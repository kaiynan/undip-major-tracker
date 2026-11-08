#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * scripts/run-all-prod-tests.js
 *
 * Starts serve-out.js on port 3222 and runs all Playwright test suites
 * with BASE_URL=http://localhost:3222 against the static export:
 * 1. scripts/test-prod-render.js
 * 2. scripts/test-navbar.js
 * 3. scripts/test-touch-reset.js
 * 4. scripts/verify-full-e2e.js
 */

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = 3222;
const BASE_URL = `http://localhost:${PORT}`;

function isServerRunning() {
  return new Promise((resolve) => {
    const req = http.request(
      {
        host: 'localhost',
        port: PORT,
        path: '/',
        method: 'HEAD',
        timeout: 1000,
      },
      (res) => resolve(res.statusCode >= 200 && res.statusCode < 500)
    );
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

function runCommand(command, args, env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      env: { ...process.env, ...env },
      shell: true,
    });
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command ${command} ${args.join(' ')} failed with code ${code}`));
    });
    child.on('error', reject);
  });
}

async function main() {
  console.log('==================================================================');
  console.log('🚀 RUNNING ALL TESTS AGAINST PRODUCTION BUILD (http://localhost:3222)');
  console.log('==================================================================\n');

  let serverProcess = null;
  const running = await isServerRunning();
  if (!running) {
    console.log(`[INFO] Starting serve-out.js on port ${PORT}...`);
    serverProcess = spawn('node', [path.join(__dirname, 'serve-out.js'), path.join(__dirname, '..', 'out'), String(PORT)], {
      stdio: 'pipe',
    });
    for (let i = 0; i < 25; i++) {
      await new Promise((r) => setTimeout(r, 200));
      if (await isServerRunning()) break;
    }
  }

  try {
    console.log('\n[SUITE 1/4] Running test-prod-render.js...');
    await runCommand('node', [path.join(__dirname, 'test-prod-render.js')], { BASE_URL });

    console.log('\n[SUITE 2/4] Running test-navbar.js across 113 viewports...');
    await runCommand('node', [path.join(__dirname, 'test-navbar.js')], { BASE_URL });

    console.log('\n[SUITE 3/4] Running test-touch-reset.js across all touch reset controls...');
    await runCommand('node', [path.join(__dirname, 'test-touch-reset.js')], { BASE_URL });

    console.log('\n[SUITE 4/4] Running verify-full-e2e.js across 11 viewports...');
    await runCommand('node', [path.join(__dirname, 'verify-full-e2e.js')], { BASE_URL });

    console.log('\n==================================================================');
    console.log('🎉 ALL 4 PRODUCTION TEST SUITES PASSED SUCCESSFULLY!');
    console.log('==================================================================\n');
  } finally {
    if (serverProcess) {
      serverProcess.kill();
    }
  }
}

main().catch((err) => {
  console.error('\n❌ Production test run failed:', err.message);
  process.exit(1);
});
