'use client';

import { useEffect } from 'react';

export function PwaRegistrar() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Unregister any active service workers in development to prevent stale chunk errors
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
            console.log('Unregistered development service worker:', registration.scope);
          }
        });
      }

      // Clear any caches from previous service worker sessions
      if ('caches' in window) {
        caches.keys().then((names) => {
          for (const name of names) {
            caches.delete(name);
            console.log('Cleared stale cache:', name);
          }
        });
      }
    }
  }, []);

  return null;
}
