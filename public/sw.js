/* Catz service worker. Bump VERSION when this file changes in a way that needs a clean cache.
 *
 * - /_next/static/*  cache-first (content-hashed, safe to keep)
 * - page navigations network-first, then the cached copy, then /offline
 * - the page asks us to WARM the app routes after install, so the whole app works offline
 */
const VERSION = "catz-v1";
const STATIC = `${VERSION}-static`;
const PAGES = `${VERSION}-pages`;
const PRECACHE = ["/offline", "/icons/icon-192.png", "/icons/icon-512.png"];
const MAX_STATIC = 200;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(PAGES).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function trim(cache, max) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok) {
    cache.put(request, res.clone());
    trim(cache, MAX_STATIC);
  }
  return res;
}

async function networkFirst(request, fallbackUrl) {
  const cache = await caches.open(PAGES);
  try {
    const res = await fetch(request);
    if (res.ok) cache.put(request, res.clone());
    return res;
  } catch {
    const hit = await cache.match(request);
    if (hit) return hit;
    if (fallbackUrl) {
      const fb = await cache.match(fallbackUrl);
      if (fb) return fb;
    }
    return Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
  } else if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, "/offline"));
  } else if (url.searchParams.has("_rsc") || url.pathname.startsWith("/icons/")) {
    event.respondWith(networkFirst(request));
  }
});

/** Fetch the given pages and every static asset they reference, so they open offline. */
async function warm(urls) {
  const pages = await caches.open(PAGES);
  const statics = await caches.open(STATIC);
  const assets = new Set();
  await Promise.all(
    urls.map(async (u) => {
      try {
        const res = await fetch(u, { credentials: "same-origin" });
        if (!res.ok) return;
        await pages.put(new Request(u), res.clone());
        const html = await res.text();
        for (const m of html.matchAll(/\/_next\/static\/[^"'\\)\s<>]+/g)) assets.add(m[0]);
      } catch {
        /* offline while warming: try again next visit */
      }
    }),
  );
  await Promise.all(
    [...assets].map(async (a) => {
      if (await statics.match(a)) return;
      try {
        const res = await fetch(a);
        if (res.ok) await statics.put(a, res);
      } catch {
        /* ignore */
      }
    }),
  );
}

self.addEventListener("message", (event) => {
  if (event.data?.type === "WARM" && Array.isArray(event.data.urls)) event.waitUntil(warm(event.data.urls));
});
