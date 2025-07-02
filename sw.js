
const CACHE_NAME = 'colorpro-v1';
const urlsToCache = [
  '/palettepro/',
  '/palettepro/static/js/bundle.js',
  '/palettepro/static/css/main.css',
  '/palettepro/manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
