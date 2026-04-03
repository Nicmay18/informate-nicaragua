const STATIC_CACHE = 'static-v8';
const IMAGE_CACHE = 'images-v8';

const STATIC_ASSETS = ['/', '/offline.html', '/logo.png', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== STATIC_CACHE && k !== IMAGE_CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Escuchar mensaje para forzar actualización inmediata
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 🛑 EXCLUIR RADIOS: Si la URL contiene "stream", "radiojar", "zeno", "ecmdigital" o "futura", no usar el Service Worker
  if (url.href.includes('stream') || 
      url.href.includes('radiojar') || 
      url.href.includes('zeno') || 
      url.href.includes('ecmdigital') ||
      url.href.includes('futurafm')) {
    return; // Esto permite que el audio pase directo por la red normal
  }

  // SOLO cachear GET - nunca POST, PUT, DELETE
  if (request.method !== 'GET') return;

  // No cachear APIs ni Firebase
  if (url.pathname.startsWith('/api/') || url.hostname.includes('firestore') || url.hostname.includes('googleapis')) return;

  // Imágenes: Cache First
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // HTML: Network First con fallback offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then((cached) => cached || caches.match('/offline.html'))
      )
    );
    return;
  }

  // Resto: Cache First
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

// Push Notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let data;
  try {
    data = event.data.json();
  } catch(e) {
    data = { title: 'Nicaragua Informate', body: event.data.text(), url: '/' };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'Nicaragua Informate', {
      body: data.body || 'Nueva noticia',
      icon: '/logo.png',
      badge: '/logo.png',
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || '/'));
});
