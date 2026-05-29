const CACHE_NAME = 'marketmallow-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/manifest.json'
];

// Instalação: Cacheia arquivos estáticos básicos
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Estratégia Stale-While-Revalidate: 
// Serve do cache imediatamente (rápido/offline) e atualiza o cache em background se houver net.
self.addEventListener('fetch', (event) => {
  // Ignora requisições de outras origens (ex: fontes externas ou analytics) se houver
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Se a resposta for válida, salva no cache
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Se falhar o fetch e não tiver no cache, não tem o que fazer
      });

      // Retorna o cache se existir, se não espera o fetch
      return cachedResponse || fetchPromise;
    })
  );
});
