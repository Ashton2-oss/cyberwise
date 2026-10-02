const CACHE_NAME = 'cyberwise-shell-v8';
const APP_SHELL = [
  './',
  './index.html',
  './landing.html',
  './guide.html',
  './screen6.html',
  './daily.html',
  './data_breach.html',
  './social_safety.html',
  './recovery.html',
  './recover.html',
  './dashboard.html',
  './hub.html',
  './navigation.js',
  './register-sw.js',
  './quiz-data.js',
  './hub-tools.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(APP_SHELL);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(key) {
        return key.startsWith('cyberwise-shell-') && key !== CACHE_NAME;
      }).map(function(key) {
        return caches.delete(key);
      }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then(function(cached) {
      if (cached) return cached;

      return fetch(request).then(function(response) {
        if (response && response.ok && request.url.startsWith(self.location.origin)) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(function() {
        if (request.mode === 'navigate') {
          return caches.match('./landing.html')
            || caches.match('./hub.html')
            || caches.match('./dashboard.html');
        }
        return caches.match(request) || Response.error();
      });
    })
  );
});
