const CACHE_NAME = "the-chatting-v5"; 

const ASSETS = [
  "/chattingplatform/",
  "/chattingplatform/index.html",
  "/chattingplatform/style.css",
  "/chattingplatform/script.js",
  "/chattingplatform/manifest.json",
  "/chattingplatform/icon-192.png",
  "/chattingplatform/icon-512.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
