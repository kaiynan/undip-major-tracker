'use client';

import { useEffect } from 'react';

export function PwaRegistrar() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // 1. In development mode, NEVER register Service Worker.
    // Proactively UNREGISTER any existing Service Worker and clear stale caches to avoid hydration mismatch.
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((success) => {
            if (success) {
              console.log('[PWA-Dev] Unregistered development service worker:', registration.scope);
            }
          });
        }
      });

      if ('caches' in window) {
        caches.keys().then((cacheNames) => {
          for (const cacheName of cacheNames) {
            caches.delete(cacheName).then(() => {
              console.log('[PWA-Dev] Cleared stale cache:', cacheName);
            });
          }
        });
      }
      return;
    }

    // 2. In production, register Service Worker for offline PWA capabilities.
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (
                installingWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                console.log('New content is available; please refresh.');
              }
            });
          }
        });
      } catch (error) {
        console.warn('ServiceWorker registration failed:', error);
      }
    };

    if (document.readyState === 'complete') {
      registerSW();
    } else {
      window.addEventListener('load', registerSW);
      return () => {
        window.removeEventListener('load', registerSW);
      };
    }
  }, []);

  return null;
}
