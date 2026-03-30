const STATIC_CACHE = 'static-v3';
const IMAGE_CACHE = 'images-v3';
const API_CACHE = 'api-v3';

const STATIC_ASSETS = ['/', '/offline.html', '/logo.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => ![STATIC_CACHE, IMAGE_CACHE, API_CACHE].includes(name))
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Imágenes: Cache First
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            fetch(request).then((nr) => { if (nr.ok) cache.put(request, nr.clone()); });
            return response;
          }
          return fetch(request).then((nr) => {
            if (nr.ok) cache.put(request, nr.clone());
            return nr;
          });
        });
      })
    );
    return;
  }

  // Firestore: Network First
  if (url.hostname.includes('firestore.googleapis.com')) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        return fetch(request).then((nr) => {
          if (nr.ok) cache.put(request, nr.clone());
          return nr;
        }).catch(() => cache.match(request).then((cr) => cr || new Response(JSON.stringify({offline: true}))));
      })
    );
    return;
  }

  // HTML: Network First
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request).then((cr) => cr || caches.match('/offline.html'));
      })
    );
    return;
  }

  // Default: Cache First
  event.respondWith(
    caches.match(request).then((cr) => cr || fetch(request))
  );
});

// Push Notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'Nicaragua Informate', {
      body: data.body || 'Nueva noticia importante',
      icon: '/logo.png',
      badge: '/logo.png',
      tag: data.tag || 'breaking-news',
      requireInteraction: true,
      actions: [
        {action: 'read', title: 'Leer ahora'},
        {action: 'close', title: 'Cerrar'}
      ],
      data: {url: data.url || '/', noticiaId: data.noticiaId}
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const { url } = event.notification.data || {};
  if (event.action === 'read' || !event.action) {
    event.waitUntil(clients.openWindow(url));
  }
});
