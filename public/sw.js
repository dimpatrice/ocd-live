// Service Worker désactivé et autonettoyant : supprime immédiatement tous les caches et se désenregistre
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).then(() => {
      self.clients.claim();
    })
  );
});

// Toutes les requêtes passent toujours en direct par le réseau (Network First sans cache)
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request));
});
