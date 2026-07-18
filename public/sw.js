const CACHE_VERSION = 'v4'
const APP_CACHE = `radio-l20-app-${CACHE_VERSION}`
const IMAGES_CACHE = `radio-l20-images-${CACHE_VERSION}`
const FONTS_CACHE = `radio-l20-fonts-${CACHE_VERSION}`
const API_CACHE = `radio-l20-api-${CACHE_VERSION}`

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/l20-icon.svg',
  '/logo-oficial.svg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => {
              return (
                name !== APP_CACHE &&
                name !== IMAGES_CACHE &&
                name !== FONTS_CACHE &&
                name !== API_CACHE
              )
            })
            .map((name) => caches.delete(name)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET') return

  if (url.pathname === '/sw.js') return

  if (url.hostname === 'firestore.googleapis.com') {
    event.respondWith(networkFirst(request, API_CACHE, 5000))
    return
  }

  if (url.hostname === 'fonts.googleapis.com') {
    event.respondWith(staleWhileRevalidate(request, FONTS_CACHE))
    return
  }

  if (url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, FONTS_CACHE, 60 * 60 * 24 * 365))
    return
  }

  if (/\.(?:png|gif|jpg|jpeg|webp|ico)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request, IMAGES_CACHE, 60 * 60 * 24 * 30))
    return
  }

  if (/\.(?:woff2|woff|ttf|eot)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request, FONTS_CACHE, 60 * 60 * 24 * 365))
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, APP_CACHE, 0))
    return
  }

  if (/\.(?:js|css)$/i.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, APP_CACHE))
    return
  }

  if (/\.(?:svg)$/i.test(url.pathname) && url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request, IMAGES_CACHE, 60 * 60 * 24 * 30))
    return
  }
})

async function networkFirst(request, cacheName, timeout) {
  const cache = await caches.open(cacheName)

  try {
    const controller = new AbortController()
    const timeoutId = timeout > 0 ? setTimeout(() => controller.abort(), timeout) : null

    const response = await fetch(request, { signal: controller.signal })
    if (timeoutId) clearTimeout(timeoutId)

    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await cache.match(request)
    if (cached) return cached

    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline.html')
      if (offlinePage) return offlinePage
    }

    return new Response('Indisponível', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  }
}

async function cacheFirst(request, cacheName, maxAgeSeconds) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  if (cached) {
    const dateHeader = cached.headers.get('sw-cached-at')
    if (dateHeader) {
      const cachedAt = Number(dateHeader)
      if (Date.now() - cachedAt < maxAgeSeconds * 1000) {
        return cached
      }
    } else {
      return cached
    }
  }

  try {
    const response = await fetch(request)
    if (response.ok) {
      const headers = new Headers(response.headers)
      headers.set('sw-cached-at', String(Date.now()))
      const timedResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      })
      cache.put(request, timedResponse.clone())
      return timedResponse
    }
    return response
  } catch {
    return cached || new Response('Indisponível offline', { status: 503 })
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => cached)

  return cached || fetchPromise
}

self.addEventListener('push', (event) => {
  let data = { title: 'Rádio L20', body: '', url: '/' }

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() }
    } catch {
      data.body = event.data.text()
    }
  }

  const options = {
    body: data.body,
    icon: '/l20-icon.svg',
    badge: '/favicon.svg',
    tag: 'radio-l20',
    renotify: true,
    data: { url: data.url || '/' },
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const url = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus()
          if (url !== '/') client.navigate(url)
          return
        }
      }
      return self.clients.openWindow(url)
    }),
  )
})
