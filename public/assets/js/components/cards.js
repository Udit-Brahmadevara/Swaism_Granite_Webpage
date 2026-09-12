/**
 * Shared card and list renderers.
 *
 * Every repeated block on the site is defined here once. Pages compose these
 * rather than writing their own markup, so a change to a card's structure or
 * classes happens in one place. Each function returns an HTML string; none of
 * them touch the DOM.
 */
import { esc } from '../core/dom.js';

/* Image helpers -----------------------------------------------------------
   Every photograph ships in two sizes and two formats (see tools/build-images.py).
   `picture()` emits the WebP with a JPEG fallback; browsers pick one and fetch
   only that. Serving the display-size file into a grid tile was the largest
   avoidable download on the site. */
const webp  = src => src.replace(/\.(jpe?g|png)$/i, '.webp');
const thumb = src => src.replace(/\/([^/]+)$/, '/thumbs/$1');

export const picture = ({ src, alt, w, h, eager = false, cls = '' }) => `
  <picture${cls ? ` class="${esc(cls)}"` : ''}>
    <source srcset="${esc(webp(src))}" type="image/webp">
    <img src="${esc(src)}" alt="${esc(alt)}"${w ? ` width="${w}"` : ''}${h ? ` height="${h}"` : ''}
         ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
  </picture>`;

/** Same, but pointing at the small grid copy. */
export const thumbPicture = opts => picture({ ...opts, src: thumb(opts.src) });

/** Founding/company figures. `tone: 'light'` for the cream sections. */
export const statList = (stats, { tone = 'dark' } = {}) => stats.map(s => `
  <div class="stat${tone === 'light' ? ' stat--on-light' : ''}">
    <b>${esc(s.n)}</b><span>${esc(s.l)}</span>
  </div>`).join('');

/** Hero credibility badges; also used as the phone stats strip. */
export const badgeList = badges => badges.map(b => `
  <div class="badge"><b>${esc(b.big)}</b><span>${esc(b.small)}</span></div>`).join('');

/** Numbered quarry-to-delivery steps. Used by About and What We Do. */
export const journeySteps = steps => steps.map((t, i) => `
  <div class="journey__step">
    <b>${String(i + 1).padStart(2, '0')}</b><span>${esc(t)}</span>
  </div>`).join('');

/** Product tiles; `wide: true` spans the whole row. */
export const productCards = products => products.map(p => `
  <div class="product${p.wide ? ' product--wide' : ''}">
    <h3 class="product__name">${esc(p.t)}</h3>
    <p class="product__copy">${esc(p.d)}</p>
  </div>`).join('');

/** Linked stone tiles for the home page collection strip. */
export const stoneCards = stones => stones.map(g => `
  <a class="stone-card" href="/catalogue#${esc(g.id)}">
    <span class="stone-card__img">
      ${thumbPicture({ src: g.img, alt: `${g.name} slab`, w: 440, h: 440 })}
    </span>
    <span class="stone-card__body">
      <span class="stone-card__name">${esc(g.name)}</span>
      <span class="stone-card__meta">${esc(g.type.toUpperCase())} · ${esc(g.origin)}</span>
    </span>
  </a>`).join('');

/** Selectable stone tiles for the catalogue browse grid. */
export const stoneThumbs = (stones, selectedId) => stones.map(g => `
  <button class="thumb" type="button" data-id="${esc(g.id)}" aria-pressed="${g.id === selectedId}">
    <span class="thumb__img">
      ${thumbPicture({ src: g.img, alt: g.name, w: 440, h: 440 })}
    </span>
    <span class="thumb__body">
      <b>${esc(g.name)}</b><span>${esc(g.type.toUpperCase())}</span>
    </span>
  </button>`).join('');

/** Value propositions on the dark About band. */
export const valueCards = values => values.map(v => `
  <div class="value">
    <div class="value__name">${esc(v.t)}</div>
    <div class="value__copy">${esc(v.d)}</div>
  </div>`).join('');

/** Client quotes. */
export const quoteCards = quotes => quotes.map(t => `
  <figure class="card card--pad quote">
    <span class="quote__mark" aria-hidden="true">&ldquo;</span>
    <blockquote>${esc(t.quote)}</blockquote>
    <figcaption>
      <span class="quote__name">${esc(t.name)}</span>
      <span class="label label--tight">${esc([t.company, t.country].filter(Boolean).join(', '))}</span>
    </figcaption>
  </figure>`).join('');

/** Article grid cards. `image` is the decorative lead photograph. */
export const articleCards = (articles, imageFor) => articles.map((a, i) => `
  <article class="article-card">
    <div class="article-card__img">
      <span class="article-card__tag">${esc(a.tag)}</span>
      ${thumbPicture({ src: imageFor(i).img, alt: '' })}
    </div>
    <div class="article-card__body">
      <div class="label label--tight">${esc(a.date)} · ${esc(a.read)}</div>
      <h3>${esc(a.title)}</h3>
      <p>${esc(a.excerpt)}</p>
    </div>
  </article>`).join('');

/** Definition rows used for specs, office hours and contact details. */
export const defRows = pairs => pairs.map(([k, v]) => `
  <div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');

/** Chip / filter buttons. */
export const chips = (items, { active, variant = '', attr = 'data-filter' }) =>
  items.map(item => {
    const value = typeof item === 'string' ? item : item.value;
    const label = typeof item === 'string' ? item : item.label;
    return `<button class="chip${variant ? ' ' + variant : ''}" type="button"
      ${attr}="${esc(value)}" aria-pressed="${value === active}">${esc(label)}</button>`;
  }).join('');
