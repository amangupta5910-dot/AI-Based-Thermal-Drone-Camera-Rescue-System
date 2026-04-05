const CACHE_NAME = 'starfleet-disaster-v1';
const API_CACHE_NAME = 'starfleet-api-v1';
const IMAGE_CACHE_NAME = 'starfleet-images-v1';

// URLs to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/dashboard',
  '/analytics',
  '/blockchain',
  '/crowdsource',
  '/chatbot',
  '/notifications',
  '/iot',
  '/manifest.json',
  '/favicon.ico'
];

// API endpoints that can be cached
const CACHEABLE_API_ENDPOINTS = [
  '/api/chatbot',
  '/api/health',
  '/api/iot/data',
  '/api/iot/alerts',
  '/api/ai/risk-analysis'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== API_CACHE_NAME && 
              cacheName !== IMAGE_CACHE_NAME) {
            console.log('Service Worker: Clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  return self.clients.claim();
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(event));
    return;
  }
  
  // Handle static assets
  event.respondWith(handleStaticRequest(event));
});

// Handle API requests with network-first strategy
async function handleApiRequest(event) {
  const request = event.request;
  const url = new URL(request.url);
  
  // Check if this is a cacheable API endpoint
  const isCacheableEndpoint = CACHEABLE_API_ENDPOINTS.some(endpoint => 
    url.pathname.startsWith(endpoint)
  );
  
  if (!isCacheableEndpoint) {
    // For non-cacheable endpoints, try network first, then error
    try {
      const response = await fetch(request);
      return response;
    } catch (error) {
      console.log('Service Worker: Network request failed, returning offline response');
      return new Response(
        JSON.stringify({
          error: 'offline',
          message: 'You are currently offline. Please check your internet connection.',
          timestamp: new Date().toISOString()
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  }
  
  // For cacheable endpoints, try network first, then cache
  try {
    const response = await fetch(request);
    
    // Clone the response to cache it
    const responseClone = response.clone();
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, responseClone);
    }
    
    return response;
  } catch (error) {
    console.log('Service Worker: Network request failed, trying cache');
    
    // Try to get from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response
    return new Response(
      JSON.stringify({
        error: 'offline',
        message: 'You are currently offline. Please check your internet connection.',
        cached: false,
        timestamp: new Date().toISOString()
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(event) {
  const request = event.request;
  
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache, try network
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const responseClone = response.clone();
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, responseClone);
    }
    
    return response;
  } catch (error) {
    console.log('Service Worker: Both cache and network failed for static request');
    
    // For HTML requests, return offline page
    if (request.headers.get('accept')?.includes('text/html')) {
      return new Response(
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Starfleet Disaster Response - Offline</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              padding: 20px;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              max-width: 500px;
              text-align: center;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .icon {
              width: 80px;
              height: 80px;
              background: #f3f4f6;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 20px;
            }
            .icon svg {
              width: 40px;
              height: 40px;
              color: #6b7280;
            }
            h1 {
              color: #1f2937;
              margin: 0 0 10px 0;
              font-size: 24px;
            }
            p {
              color: #6b7280;
              margin: 0 0 30px 0;
              line-height: 1.5;
            }
            .button {
              background: #3b82f6;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
              margin: 5px;
            }
            .button:hover {
              background: #2563eb;
            }
            .button.secondary {
              background: #f3f4f6;
              color: #374151;
            }
            .button.secondary:hover {
              background: #e5e7eb;
            }
            .features {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin: 30px 0;
              text-align: left;
            }
            .feature {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .feature svg {
              width: 20px;
              height: 20px;
              color: #10b981;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h1>You're Offline</h1>
            <p>Don't worry! Starfleet Disaster Response continues to work offline. Your cached data is available and will sync when you're back online.</p>
            
            <div class="features">
              <div class="feature">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span>Emergency Contacts</span>
              </div>
              <div class="feature">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>Shelter Locations</span>
              </div>
              <div class="feature">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>Offline Reports</span>
              </div>
              <div class="feature">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <span>Cached Alerts</span>
              </div>
            </div>
            
            <button class="button" onclick="window.location.reload()">
              Try Reconnecting
            </button>
            <button class="button secondary" onclick="window.location.href='/'">
              Go to Home
            </button>
          </div>
        </body>
        </html>
        `,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html'
          }
        }
      );
    }
    
    // For other failed requests, return error
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Handle background sync
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data when back online
async function syncOfflineData() {
  try {
    // Get all offline data from IndexedDB
    const offlineData = await getOfflineData();
    
    // Sync each item
    for (const item of offlineData) {
      try {
        const response = await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body
        });
        
        if (response.ok) {
          // Remove from offline storage
          await removeOfflineData(item.id);
          console.log('Service Worker: Successfully synced offline data', item.id);
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync offline data', item.id, error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Error during background sync', error);
  }
}

// Helper functions for IndexedDB operations
async function getOfflineData() {
  // This would interact with IndexedDB to get stored offline data
  // For now, return empty array
  return [];
}

async function removeOfflineData(id) {
  // This would remove item from IndexedDB
  console.log('Removing offline data:', id);
}

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data.text(),
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'view',
        title: 'View Details'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Starfleet Disaster Alert', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Handle message events from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data.type === 'CACHE_URLS') {
    // Cache additional URLs
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(event.data.urls))
    );
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    // Clear all caches
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});