// sw.js

const CACHE_NAME = 'nostrnet-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/index.html',
  'https://www.nostrnet.work/', 
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response to use it in the browser and cache
        const responseClone = response.clone();

        // Cache the fetched resource
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseClone);
          });

        return response;
      })
      .catch(() => {
        // If network request fails, try to fetch from cache
        return caches.match(event.request);
      })
  );
});
