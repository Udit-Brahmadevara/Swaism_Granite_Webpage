/**
 * Service worker — makes the site fast and usable on a bad connection.
 *
 * Strategy differs by asset type, which matters more than any single cache:
 *
 *   fonts, images, the map SVG   cache-first
 *       A repeat visit makes no network request for them at all.
 *
 *   pages, CSS, JS               stale-while-revalidate
 *       Paint instantly from cache, refresh in the background. A visitor on a
 *       slow link sees the site immediately; the next visit has the update.
 *
 * CACHE is stamped by tools/bump-sw.mjs with a hash of the files it covers, and
 * a new stamp makes the worker drop everything on activate. `npm run check`
 * fails if the stamp is stale.
 *
 * Redirects are never stored or served. Cloudflare redirects /about.html to
 * /about, and a cached redirected response handed to a navigation is rejected
 * by the browser outright (net::ERR_FAILED) — which broke every internal link
 * for returning visitors before this was fixed.
 */
const CACHE = 'swasim-fe986e17';

/* Enough to render any page offline after the first visit. URLs are in the
   extensionless form the host serves, so none of them redirect. 404.html is
   deliberately absent: the host serves it for paths that do not exist. */
const PRECACHE = [
  '/', '/about', '/catalogue', '/what-we-do', '/articles', '/brochure',
  '/testimonials', '/contact', '/privacy',
  '/assets/css/site.css',
  '/assets/js/data.js',
  '/assets/js/core/dom.js', '/assets/js/core/carousel.js', '/assets/js/core/register-sw.js',
  '/assets/js/components/chrome.js', '/assets/js/components/cards.js',
  '/assets/fonts/barlow-400.woff2',
  '/assets/fonts/barlow-600.woff2',
  '/assets/fonts/cormorant-garamond-600.woff2',
  '/assets/brand/swasim-logo.webp',
  '/assets/brand/swasim-logo-light.webp',
];

const isForever = url =>
  /^\/assets\/(fonts|granite|monuments|brand|img)\//.test(url.pathname);

/** Only a plain, final, same-origin success may be stored. */
const cacheable = res => res.ok && !res.redirected && res.type === 'basic';

self.addEventListener('install', e => {
  // cache: 'no-cache' revalidates with the server rather than copying whatever
  // the HTTP cache holds, so a new release never precaches the previous files.
  // A single missing file must not fail the whole install.
  e.waitUntil(caches.open(CACHE)
    .then(c => Promise.allSettled(PRECACHE.map(u =>
      fetch(u, { cache: 'no-cache' }).then(res => cacheable(res) && c.put(u, res)))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;   // never touch third-party requests

  const store = res => {
    if (cacheable(res)) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(request, copy)); }
    return res;
  };

  if (isForever(url)) {
    e.respondWith(caches.match(request).then(hit => hit || fetch(request).then(store)));
    return;
  }

  // stale-while-revalidate for pages, CSS and JS
  e.respondWith(caches.match(request).then(hit => {
    if (hit && hit.redirected) hit = undefined;   // see the note at the top
    const net = fetch(request).then(store).catch(() => hit);
    return hit || net;
  }));
});
