const CACHE_NAME = 'define-your-next-move-v5';

const PRECACHE_URLS = [
  '/',
  '/questionnaire',
  '/results',
  '/program-studi',
  '/langkah-selanjutnya',
  '/langkah-selanjutnya/biaya-ukt',
  '/langkah-selanjutnya/beasiswa',
  '/langkah-selanjutnya/jadwal-seleksi',
  '/offline',
  '/manifest.webmanifest',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/images/logos/undip.png',
  '/images/logos/sedulur-serang-diponegoro.png',
  '/images/logos/gema-saujana.png',
  '/fonts/press-start-2p.woff2',
  '/fonts/silkscreen-400.woff2',
  '/fonts/silkscreen-700.woff2',
  '/fonts/geist-sans.woff2',
  '/fonts/geist-mono.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return Promise.allSettled(
          PRECACHE_URLS.map((url) =>
            fetch(url, { cache: 'no-cache' })
              .then((res) => {
                if (res.ok) {
                  return cache.put(url, res);
                }
              })
              .catch((err) => {
                console.warn('Precache failed for:', url, err);
              })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // Skip non-http/https requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Bypass all Next.js development, HMR, and webpack hot reload assets
  if (
    url.pathname.includes('/_next/webpack-hmr') ||
    url.pathname.includes('/_next/static/webpack/') ||
    url.pathname.startsWith('/__nextjs') ||
    url.pathname.includes('hot-update')
  ) {
    return;
  }

  // Handle HTML navigation requests (pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback to offline page
          const offlineFallback = await caches.match('/offline');
          if (offlineFallback) {
            return offlineFallback;
          }
          return caches.match('/');
        })
    );
    return;
  }

  // Handle static assets (fonts, images, icons, scripts, styles)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Optional background revalidation
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {
            // Ignore background revalidation errors
          });
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (url.origin === self.location.origin)
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If asset fetch fails and not cached, return empty or undefined
          return cachedResponse;
        });
    })
  );
});
