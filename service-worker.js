const CACHE_NAME = "the-chatting-v4";

self.addEventListener("install", (event) => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/chattingplatform/",
        "/chattingplatform/index.html",
        "/chattingplatform/style.css?v=3",
        "/chattingplatform/script.js?v=3",
        "/chattingplatform/manifest.json",
        "/chattingplatform/icon-192.png",
        "/chattingplatform/icon-512.png"
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); 
          }
        })
      );
    })
  );
  self.clients.claim(); 
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
