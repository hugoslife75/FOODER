// Registers the service worker for PWA support.
// Called once from main.tsx.

export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[SW] registered', reg.scope)
        })
        .catch((err) => {
          console.warn('[SW] registration failed', err)
        })
    })
  }
}
