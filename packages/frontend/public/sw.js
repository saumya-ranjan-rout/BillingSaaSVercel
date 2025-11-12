import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Background sync for offline mutations
const bgSyncPlugin = new BackgroundSyncPlugin('invoiceQueue', {
  maxRetentionTime: 24 * 60, // Retry for 24 hours
});

// API routes - Network First with offline fallback
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [bgSyncPlugin],
    networkTimeoutSeconds: 3,
  })
);

// Static assets - Cache First
registerRoute(
  ({ request }) => request.destination === 'style' ||
                   request.destination === 'script' ||
                   request.destination === 'image',
  new CacheFirst({
    cacheName: 'static-assets',
  })
);

// Periodic sync for background data updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'invoice-sync') {
    event.waitUntil(syncInvoices());
  }
});

async function syncInvoices() {
  const cache = await caches.open('api-cache');
  const response = await fetch('/api/invoices/sync');
  if (response.ok) {
    const data = await response.json();
    // Update local cache with new data
  }
}
