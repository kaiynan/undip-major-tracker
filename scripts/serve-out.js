#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * scripts/serve-out.js
 *
 * Zero-dependency static server that mimics Vercel routing for Next.js static export.
 * Resolution rules:
 * 1. Exact file match (if file exists and is not a directory).
 * 2. <path>.html (prefers <path>.html over directory match with same name).
 * 3. <path>/index.html.
 * 4. 404.html with status 404.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const outDir = path.resolve(process.argv[2] || path.join(__dirname, '..', 'out'));
const port = parseInt(process.argv[3] || '3222', 10);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function resolveFilePath(reqPath) {
  // Strip trailing slashes unless root
  let cleanPath = reqPath;
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }

  // 1. Exact file (if directly pointing to a file)
  const exactPath = path.join(outDir, cleanPath);
  if (fs.existsSync(exactPath)) {
    const stat = fs.statSync(exactPath);
    if (stat.isFile()) {
      return { filePath: exactPath, status: 200 };
    }
  }

  // Next.js RSC static payload mapping:
  // In Next.js App Router static exports, client prefetch requests
  // e.g. /<path>/__next.<route>.__PAGE__.txt or /<path>/__next.<route>.$d$id.__PAGE__.txt
  // while on disk Next writes /<path>/__next.<route>/__PAGE__.txt or /<path>/__next.<route>/$d$id/__PAGE__.txt
  if (cleanPath.includes('.__PAGE__.txt')) {
    const singleLevel = cleanPath.replace('.__PAGE__.txt', '/__PAGE__.txt');
    const singlePath = path.join(outDir, singleLevel);
    if (fs.existsSync(singlePath) && fs.statSync(singlePath).isFile()) {
      return { filePath: singlePath, status: 200 };
    }

    const dynamicLevel = cleanPath.replace('.$d$id.__PAGE__.txt', '/$d$id/__PAGE__.txt');
    const dynamicPath = path.join(outDir, dynamicLevel);
    if (fs.existsSync(dynamicPath) && fs.statSync(dynamicPath).isFile()) {
      return { filePath: dynamicPath, status: 200 };
    }

    // Handle nested routes e.g. /langkah-selanjutnya/biaya-ukt/__next.langkah-selanjutnya.biaya-ukt.__PAGE__.txt
    // where on disk it is out/langkah-selanjutnya/biaya-ukt/__next.langkah-selanjutnya/biaya-ukt/__PAGE__.txt
    const nextIdx = cleanPath.indexOf('/__next.');
    if (nextIdx !== -1) {
      const prefix = cleanPath.slice(0, nextIdx);
      const afterNext = cleanPath.slice(nextIdx + '/__next.'.length).replace('.__PAGE__.txt', '');
      const segments = afterNext.split('.');
      const nestedPath = path.join(outDir, prefix, `__next.${segments.join(path.sep)}`, '__PAGE__.txt');
      if (fs.existsSync(nestedPath) && fs.statSync(nestedPath).isFile()) {
        return { filePath: nestedPath, status: 200 };
      }
    }
  }

  // 2. <path>.html - PREFER THIS OVER A SAME-NAMED DIRECTORY
  // (Next.js static export creates e.g. results.html next to results/ folder)
  const htmlPath = path.join(outDir, `${cleanPath}.html`);
  if (fs.existsSync(htmlPath)) {
    const stat = fs.statSync(htmlPath);
    if (stat.isFile()) {
      return { filePath: htmlPath, status: 200 };
    }
  }

  // 3. <path>/index.html
  const indexPath = path.join(outDir, cleanPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    const stat = fs.statSync(indexPath);
    if (stat.isFile()) {
      return { filePath: indexPath, status: 200 };
    }
  }

  // 4. Fallback to 404.html
  const notFoundPath = path.join(outDir, '404.html');
  if (fs.existsSync(notFoundPath)) {
    return { filePath: notFoundPath, status: 404 };
  }

  return { filePath: null, status: 404 };
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  const pathname = decodeURIComponent(parsedUrl.pathname || '/');

  const { filePath, status } = resolveFilePath(pathname);

  if (!filePath) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  const mime = getMimeType(filePath);
  const stat = fs.statSync(filePath);

  res.writeHead(status, {
    'Content-Type': mime,
    'Content-Length': stat.size,
    'Cache-Control': 'no-cache',
    'X-Served-By': 'serve-out',
  });

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

server.listen(port, () => {
  console.log(`🚀 [SERVE-OUT] Serving static export from: ${outDir}`);
  console.log(`🌐 Server running at: http://localhost:${port}`);
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
