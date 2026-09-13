/**
 * Site chrome: the header, footer and mobile navigation shared by every page.
 *
 * `NAV` is the single definition of the site's navigation — the header, the
 * footer list and the active-page highlight all derive from it, so navigation
 * cannot drift between pages. Pages mark themselves with
 * `<body data-page="catalogue">`.
 *
 * Unlike the rest of the modules this one has a side effect: importing it
 * mounts the chrome. That is deliberate — every page needs it — but it is why
 * the DOM helpers live in core/dom.js instead.
 */
import { COMPANY, AFFILIATIONS, SOCIAL, MAPS } from '../data.js';
import { esc, qs, mount } from '../core/dom.js';
import '../core/register-sw.js';

export const NAV = [
  { key: 'home',         label: 'Home',         href: '/' },
  { key: 'about',        label: 'About Us',     href: '/about' },
  { key: 'catalogue',    label: 'Catalogue',    href: '/catalogue' },
  { key: 'what-we-do',   label: 'What We Do',   href: '/what-we-do' },
  // hidden: built but not linked until ready; also listed in HIDDEN in tools/pages.py
  { key: 'articles',     label: 'Articles',     href: '/articles',     hidden: true },
  { key: 'brochure',     label: 'Brochure',     href: '/brochure',     hidden: true },
  { key: 'testimonials', label: 'Testimonials', href: '/testimonials', hidden: true },
  { key: 'contact',      label: 'Contact Us',   href: '/contact' },
];

const headerHTML = current => `
  <div class="shell site-header__inner">
    <a class="brand" href="/" aria-label="${esc(COMPANY.name)} home">
      <picture class="brand__mark">
        <source srcset="/assets/brand/swasim-logo.webp" type="image/webp">
        <img src="/assets/brand/swasim-logo.png" alt="${esc(COMPANY.name)}"
             width="212" height="160" fetchpriority="high" decoding="async">
      </picture>
      <span class="brand__tag" aria-hidden="true">
        <span>QUARRY OWNERS</span><span>&amp; EXPORTERS</span>
      </span>
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
      <span class="nav-toggle__bars" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="visually-hidden">Menu</span>
    </button>
    <nav class="nav" id="site-nav" aria-label="Primary">
      ${NAV.filter(l => !l.hidden).map(l => `<a href="${l.href}"${l.key === current ? ' aria-current="page"' : ''}>${esc(l.label)}</a>`).join('')}
      <a class="btn btn--primary" href="/contact">Get B2B Quote</a>
    </nav>
  </div>`;

/* Footer icons: 24px line drawings after Tabler Icons (MIT). Drawn with a
   stroke in currentColor, so they take the footer's link colour and gold hover. */
const ICONS = {
  facebook:  '<path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"/>',
  instagram: '<path d="M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z"/><circle cx="12" cy="12" r="3"/><path d="M16.5 7.5v.01"/>',
  whatsapp:  '<path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"/><path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"/>',
  linkedin:  '<path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z"/><path d="M8 11v5"/><path d="M8 8v.01"/><path d="M12 16v-5"/><path d="M16 16v-3a2 2 0 1 0 -4 0"/>',
  email:     '<path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"/><path d="M3 7l9 6l9 -6"/>',
  phone:     '<path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"/>',
};

const iconSvg = key => `
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[key]}</svg>`;

/* Web links open in a new tab; mailto: and tel: hand off to an app anyway.
   An entry with no `href` yet still shows its icon, as plain decoration:
   nothing to click, and hidden from screen readers rather than announced as a
   link that goes nowhere. */
const socialLinks = () => SOCIAL.filter(s => ICONS[s.key]).map(s => s.href ? `
  <li><a class="foot-social__link" href="${esc(s.href)}" aria-label="${esc(s.label)}"${
    /^https?:/.test(s.href) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${iconSvg(s.key)}
  </a></li>` : `
  <li aria-hidden="true"><span class="foot-social__link">${iconSvg(s.key)}</span></li>`).join('');

const footerHTML = () => `
  <div class="site-footer__grid">
    <div class="foot-brand">
      <picture class="brand__mark">
        <source srcset="/assets/brand/swasim-logo-light.webp" type="image/webp">
        <img src="/assets/brand/swasim-logo-light.png" alt="${esc(COMPANY.name)}"
             width="212" height="160" loading="lazy" decoding="async">
      </picture>
      <p>Quarry owners, processors and exporters of Indian granite since ${COMPANY.founded}.</p>
      <ul class="foot-social">${socialLinks()}</ul>
    </div>
    <div class="foot-nav">
      <h2>Navigate</h2>
      <ul>${NAV.filter(l => !l.hidden && l.key !== 'articles')
              .map(l => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}</ul>
    </div>
    <div class="foot-contact">
      <h2>Export Desk</h2>
      <ul>
        <li>${esc(COMPANY.md)}, Managing Director</li>
        <li><a href="tel:${esc(COMPANY.phoneHref)}">${esc(COMPANY.phone)}</a></li>
        <li><a href="mailto:${esc(COMPANY.email)}">${esc(COMPANY.email)}</a></li>
        <li class="foot-address"><a href="${esc(MAPS)}" target="_blank" rel="noopener noreferrer">1279/18281, Samanapalli Road,<br>Kammandhoddi Village, Shoolagiri Taluk,<br>Krishnagiri District, Tamil Nadu 635117, India<span class="visually-hidden"> (opens in Google Maps)</span></a></li>
      </ul>
    </div>
    <div class="foot-affiliations">
      <h2>Affiliations</h2>
      <ul>${AFFILIATIONS.map(a => `<li>${esc(a.abbr)}</li>`).join('')}</ul>
    </div>
  </div>
  <div class="site-footer__base">
    <span>© ${new Date().getFullYear()} SWASIM GRANITE</span>
    <span>QUARRY OWNERS &amp; EXPORTERS · HOSUR, INDIA</span>
    <a href="/privacy">PRIVACY POLICY</a>
  </div>`;

function initNavToggle() {
  const btn = qs('.nav-toggle');
  const nav = qs('#site-nav');
  if (!btn || !nav) return;

  const setOpen = open => {
    nav.dataset.open = String(open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', () => setOpen(nav.dataset.open !== 'true'));
  // Leaving mobile width hands layout back to CSS; drop the manual state.
  matchMedia('(min-width: 901px)').addEventListener('change', e => e.matches && setOpen(false));
}

export function initChrome() {
  mount('[data-site-header]', headerHTML(document.body.dataset.page || ''));
  mount('[data-site-footer]', footerHTML());
  initNavToggle();
}

initChrome();
