const CACHE_NAME = "the-chatting-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/chattingplatform/",
        "/chattingplatform/index.html",
        "/chattingplatform/style.css",
        "/chattingplatform/script.js",
        "/chattingplatform/manifest.json",
        "/chattingplatform/icon-192.png",
        "/chattingplatform/icon-512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
