/**
 * DOM helpers. Pure — importing this module has no side effects, so a page can
 * pull in `esc` without also mounting the site chrome.
 */

/** Escape text before it is interpolated into an HTML template string. */
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const qs  = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

/**
 * Render HTML into a host element if that host exists on this page.
 * Returns the host (or null), so callers can chain without null checks.
 */
export function mount(selector, html, root = document) {
  const host = qs(selector, root);
  if (host) host.innerHTML = html;
  return host;
}

/** Attach a click handler to every element matching `sel` within `root`. */
export const onClick = (sel, fn, root = document) =>
  qsa(sel, root).forEach(el => el.addEventListener('click', () => fn(el)));

/**
 * Single-select control group: sets aria-pressed on the chosen element and
 * clears it on its siblings. Used by every filter, tab and chip row.
 */
export function setPressed(elements, isActive) {
  elements.forEach(el => el.setAttribute('aria-pressed', String(isActive(el))));
}
