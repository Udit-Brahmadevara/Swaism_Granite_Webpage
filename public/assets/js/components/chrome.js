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
import { COMPANY, CERTIFICATIONS } from '../data.js';
import { esc, qs, mount } from '../core/dom.js';
import '../core/register-sw.js';

export const NAV = [
  { key: 'home',         label: 'Home',         href: '/' },
  { key: 'about',        label: 'About Us',     href: '/about' },
  { key: 'catalogue',    label: 'Catalogue',    href: '/catalogue' },
  { key: 'what-we-do',   label: 'What We Do',   href: '/what-we-do' },
  { key: 'articles',     label: 'Articles',     href: '/articles' },
  { key: 'brochure',     label: 'Brochure',     href: '/brochure' },
  { key: 'testimonials', label: 'Testimonials', href: '/testimonials' },
  { key: 'contact',      label: 'Contact Us',   href: '/contact' },
];

const headerHTML = current => `
  <div class="shell site-header__inner">
    <a class="brand" href="/" aria-label="${esc(COMPANY.name)} — home">
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
      ${NAV.map(l => `<a href="${l.href}"${l.key === current ? ' aria-current="page"' : ''}>${esc(l.label)}</a>`).join('')}
      <a class="btn btn--primary" href="/contact">Get B2B Quote</a>
    </nav>
  </div>`;

const footerHTML = () => `
  <div class="site-footer__grid">
    <div class="foot-brand">
      <picture class="brand__mark">
        <source srcset="/assets/brand/swasim-logo-light.webp" type="image/webp">
        <img src="/assets/brand/swasim-logo-light.png" alt="${esc(COMPANY.name)}"
             width="212" height="160" loading="lazy" decoding="async">
      </picture>
      <p>Quarry owners, processors and exporters of Indian granite since ${COMPANY.founded}.</p>
    </div>
    <div class="foot-nav">
      <h2>Navigate</h2>
      <ul>${NAV.filter(l => l.key !== 'articles')
              .map(l => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}</ul>
    </div>
    <div class="foot-contact">
      <h2>Export Desk</h2>
      <ul>
        <li>${esc(COMPANY.md)}, Managing Director</li>
        <li><a href="tel:${esc(COMPANY.phoneHref)}">${esc(COMPANY.phone)}</a></li>
        <li><a href="mailto:${esc(COMPANY.email)}">${esc(COMPANY.email)}</a></li>
        <li class="foot-address">Shoolgiri / Sappadi,<br>Hosur, Tamil Nadu, India</li>
      </ul>
    </div>
    <div class="foot-certs">
      <h2>Certification</h2>
      <ul>${CERTIFICATIONS.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
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
