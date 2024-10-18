const CACHE_NAME = "abecedario-biblico-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./styles/index.css",
  "./scripts/script.js",
  "./assets/data/data.json", // Asegúrate de que esta ruta sea correcta
  "./Assets/icon512_maskable.png",
  "./Assets/icon512_rounded.png",
];

// Instalación del Service Worker y cacheo de recursos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Interceptar peticiones y servir recursos desde el cache si es posible
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si el recurso está en cache, lo devuelve. Si no, lo busca en la red.
      return (
        response ||
        fetch(event.request)
          .then((response) => {
            // Guarda en caché cualquier recurso nuevo que se obtenga de la red
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone());
              return response;
            });
          })
          .catch(() => {
            // Si no hay conexión, intenta devolver el data.json si se pidió
            if (event.request.url.endsWith("/data/data.json")) {
              return caches.match("/assets/data/data.json"); // Asegúrate de que la ruta sea correcta
            }
          })
      );
    })
  );
});

// Actualización del Service Worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
