// Fooder Service Worker — v1
// Caches static assets and enables offline support

const CACHE_NAME = 'fooder-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
]

// Install: pre-cache static shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Fetch: network-first for API, cache-first for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Always go network for Supabase API calls
  if (url.hostname.includes('supabase.co')) {
    return
  }

  // Network-first for HTML navigation
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/index.html')
      )
    )
    return
  }

  // Cache-first for static assets (JS, CSS, fonts, images)
  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ??
        fetch(event.request).then((response) => {
          // Cache successful GET responses
          if (
            response.ok &&
            event.request.method === 'GET' &&
            !url.pathname.includes('/api/')
          ) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
    )
  )
})
