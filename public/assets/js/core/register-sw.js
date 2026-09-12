/**
 * Registers the service worker — everywhere except the staging host.
 *
 * Deferred until after load so it never competes with first paint, and failure
 * is silent — the site works identically without it, just without the offline
 * cache. Skipped on file:// where service workers are unavailable.
 *
 * Staging is where the client reviews changes, and stale-while-revalidate would
 * show them the previous build on the first load after every deploy. There the
 * worker is never installed, and any worker or cache left by an earlier visit
 * is removed, so an ordinary refresh always shows the latest build.
 */
const STAGING = location.hostname.startsWith('staging.');

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  if (STAGING) {
    navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
  } else {
    addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => { /* non-fatal */ });
    });
  }
}
