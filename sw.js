// Save as sw.js
const CACHE_NAME = 'campusphere-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/map.html',
  '/Screenshot 2025-09-10 132615.png',
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'
];

self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', evt => {
  if(evt.request.method !== 'GET') return;
  evt.respondWith(
    caches.match(evt.request).then(cached => {
      if(cached) return cached;
      return fetch(evt.request).then(resp => {
        // optional: cache fetched response for future
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(evt.request, resp.clone());
          return resp;
        });
      }).catch(() => {
        // offline fallback for navigation to index/map
        if(evt.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
