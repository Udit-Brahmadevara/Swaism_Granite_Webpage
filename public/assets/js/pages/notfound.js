/**
 * 404: the site chrome plus a short way back in.
 *
 * The suggestion list is derived from NAV rather than hard-coded, so a page
 * added to the navigation cannot go missing from the one screen a lost visitor
 * actually reads.
 */
import { esc, qs } from '../core/dom.js';
import { NAV } from '../components/chrome.js';

// Four, deliberately: they fill one row cleanly, and a lost visitor scanning
// for a way back is not helped by being offered everything at once.
const BLURB = {
  catalogue:    'Every granite and marble variety we cut, each with a full-slab view.',
  'what-we-do': 'Blocks, slabs, tiles, monuments and customised work.',
  contact:      'Send volumes, thickness and finish, and get a quote back within one working day.',
  about:        'The plant at Hosur, and the markets we ship to.',
};

const host = qs('[data-notfound-links]');
if (host) {
  host.innerHTML = NAV
    .filter(l => BLURB[l.key])
    .map(l => `
      <li>
        <a href="${l.href}">
          <span class="notfound__link-label">${esc(l.label)}</span>
          <span class="notfound__link-desc">${esc(BLURB[l.key])}</span>
        </a>
      </li>`).join('');
}
