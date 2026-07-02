// Placeholders replaced at build time by scripts/postbuild.mjs
self.__BUILD_VERSION__ = undefined;
self.__CACHE_BUSTER__ = undefined;

const CACHE_VERSION = 'v2';
const PRECACHE = `chatmix-precache-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `chatmix-dynamic-${CACHE_VERSION}`;
const API_CACHE = `chatmix-api-${CACHE_VERSION}`;

// ── Install: fetch precache manifest and cache everything ──────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      try {
        const res = await fetch('/precache-manifest.json');
        const manifest = await res.json();
        const urls = manifest.map((entry) => entry.url);
        // cache.addAll fails if any single request fails, so use individual puts
        const results = await Promise.allSettled(
          urls.map(async (url) => {
            try {
              const response = await fetch(url);
              if (response.ok) {
                await cache.put(url, response);
              }
            } catch (_) { /* skip failed */ }
          }),
        );
        const succeeded = results.filter((r) => r.status === 'fulfilled').length;
        console.log(`[SW] Precached ${succeeded}/${urls.length} assets`);
      } catch (e) {
        console.warn('[SW] Precache manifest fetch failed, caching essentials', e);
        await cache.addAll(['/', '/index.html']);
      }
    })(),
  );
  self.skipWaiting();
});

// ── Message: allow client to trigger skipWaiting ───────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ── Activate: delete old caches ────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== PRECACHE && name !== DYNAMIC_CACHE && name !== API_CACHE)
          .map((name) => caches.delete(name)),
      );
    }),
  );
  self.clients.claim();
});

// ── Fetch strategy ─────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // API requests – Network first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Precached static assets (hashed filenames) – Cache first
  if (
    url.pathname.startsWith('/assets/') ||
    /\.(js|css|svg|png|ico|woff2?|ttf|eot|webp|avif)$/.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Precached root files (index.html, manifest, icons, etc.)
  if (
    url.pathname === '/' ||
    url.pathname === '/index.html' ||
    url.pathname === '/manifest.json' ||
    url.pathname === '/precache-manifest.json' ||
    url.pathname.startsWith('/icons/')
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // PWA/offline support – serve cached index.html for navigation
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithAppShellFallback(request));
    return;
  }

  // Everything else – Network first
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// ── Cache-first: return from cache, fall back to network ───────────
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

// ── Network-first: try network, fall back to cache ─────────────────
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response('Offline', { status: 503 });
  }
}

// ── Network-first with app shell fallback for navigation ───────────
async function networkFirstWithAppShellFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) return response;
    // If server returns an error (e.g., 5xx), serve the cached shell
    const shell = await caches.match('/index.html');
    if (shell) return shell;
    return response;
  } catch {
    // Offline: serve the cached shell
    const shell = await caches.match('/index.html') || await caches.match('/');
    if (shell) return shell;
    return new Response('Offline', { status: 503 });
  }
}
