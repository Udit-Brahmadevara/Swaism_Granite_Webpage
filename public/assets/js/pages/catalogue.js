/**
 * Catalogue: stone detail with filtering and search, plus the monument gallery.
 *
 * Deep-linkable — /catalogue#tan-brown opens that stone, and because a
 * hash-only change never reloads the document, hashchange is handled too.
 */
import { GRANITES, FINISHES, MONUMENTS, stoneImages } from '../data.js';
import { esc, qs, qsa, onClick, setPressed } from '../core/dom.js';
import { createCarousel } from '../core/carousel.js';
import { stoneThumbs, defRows, chips, picture } from '../components/cards.js';
import { initLightbox } from '../components/lightbox.js';
import '../components/chrome.js';

const FADE_MS = 170;
const GALLERY_ROTATE_MS = 6000;
const TYPES = ['All', 'Exotic', 'Premium', 'Commercial'];

const detail    = qs('[data-detail]');
const thumbHost = qs('[data-thumbs]');
const filterBar = qs('[data-filters]');
const search    = qs('[data-search]');

const state = { filter: 'All', finish: FINISHES[0], query: '', selected: GRANITES[0] };

const fromHash = location.hash.replace('#', '');
if (fromHash) state.selected = GRANITES.find(g => g.id === fromHash) || state.selected;

const isPhone = () => matchMedia('(max-width: 900px)').matches;

/** Type filter and free-text search compose. */
const visibleStones = () => {
  const q = state.query.trim().toLowerCase();
  return GRANITES.filter(g =>
    (state.filter === 'All' || g.type === state.filter) &&
    (!q || [g.name, g.type, g.origin, g.tagline].join(' ').toLowerCase().includes(q)));
};

function renderDetail() {
  const g = state.selected;
  const shots = stoneImages(g);
  const multi = shots.length > 1;

  detail.innerHTML = `
    <div class="stone-detail__img" data-gallery-frame>
      ${shots.map((im, i) => `
        <picture class="stone-detail__shot" data-active="${i === 0}">
          <source srcset="${esc(im.src.replace(/\.(jpe?g|png)$/i, '.webp'))}" type="image/webp">
          <img src="${esc(im.src)}" alt="${esc(im.alt)}"
               ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">
        </picture>`).join('')}
      ${multi ? `
        <div class="stone-detail__dots" role="tablist" aria-label="${esc(g.name)} photographs">
          ${shots.map((im, i) => `
            <button type="button" role="tab" data-go="${i}" aria-selected="${i === 0}"
                    aria-label="View ${i + 1} of ${shots.length}"></button>`).join('')}
        </div>
        <div class="stone-detail__nav">
          <button type="button" data-prev aria-label="Previous photograph">&#8249;</button>
          <button type="button" data-next aria-label="Next photograph">&#8250;</button>
        </div>` : ''}
      <div class="stone-detail__chips">
        <span class="badge-type badge-type--${esc(g.type.toLowerCase())}">${esc(g.type)}</span>
        <span class="badge-type badge-origin">${esc(g.origin)}</span>
      </div>
      <div class="stone-detail__format">slab format 320 × 190 cm</div>
    </div>
    <div class="stone-detail__body">
      <h2>${esc(g.name)}</h2>
      <div class="stone-detail__tagline">${esc(g.tagline)}</div>
      <p>${esc(g.description)}</p>

      <div class="label stone-detail__label">Available finishes</div>
      <div class="chips stone-detail__finishes" data-finishes>
        ${chips(FINISHES, { active: state.finish, variant: 'chip--finish', attr: 'data-finish' })}
      </div>

      <dl class="hairline stone-detail__specs">
        ${defRows([
          ['Compressive strength', g.specs.strength],
          ['Water absorption',     g.specs.absorption],
          ['Hardness',             g.specs.hardness],
          ['Bulk density',         g.specs.density],
        ])}
      </dl>

      <div class="row stone-detail__actions">
        <a class="btn btn--green" href="/contact#${esc(g.id)}">Inquire About This Stone</a>
        <a class="link-arrow" href="/contact#${esc(g.id)}">Request spec sheet</a>
      </div>
    </div>`;

  onClick('[data-finish]', el => {
    state.finish = el.dataset.finish;
    setPressed(qsa('[data-finish]', detail), x => x.dataset.finish === state.finish);
  }, detail);

  if (multi) {
    const frame  = qs('[data-gallery-frame]', detail);
    const slides = qsa('.stone-detail__shot', frame);
    const dots   = qsa('[data-go]', frame);
    createCarousel(frame, {
      count: shots.length,
      interval: GALLERY_ROTATE_MS,
      onChange: i => {
        slides.forEach((el, n) => el.dataset.active = String(n === i));
        dots.forEach((el, n) => el.setAttribute('aria-selected', String(n === i)));
      },
    });
  }
}

function renderThumbs() {
  const list = visibleStones();
  thumbHost.innerHTML = list.length
    ? stoneThumbs(list, state.selected.id)
    : `<p class="search__empty">No stone matches “${esc(state.query)}”.
         Try a colour, a stone type or an origin.</p>`;
  onClick('[data-id]', el => select(el.dataset.id, { fromTap: true }), thumbHost);
}

function select(id, { updateHash = true, fromTap = false } = {}) {
  if (id === state.selected.id) return;
  const next = GRANITES.find(g => g.id === id);
  if (!next) return;

  detail.dataset.fading = 'true';
  setTimeout(() => {
    state.selected = next;
    state.finish = FINISHES[0];
    renderDetail();
    renderThumbs();
    detail.dataset.fading = 'false';
    if (updateHash && location.hash !== `#${next.id}`) history.replaceState(null, '', `#${next.id}`);
    // On a phone the detail sits above the grid — bring it back into view.
    if (isPhone() && fromTap) detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, FADE_MS);
}

if (detail) {
  filterBar.innerHTML =
    `<span class="label">Filter</span>` + chips(TYPES, { active: state.filter });
  onClick('[data-filter]', el => {
    state.filter = el.dataset.filter;
    setPressed(qsa('[data-filter]', filterBar), x => x.dataset.filter === state.filter);
    renderThumbs();
  }, filterBar);

  if (search) {
    let debounce;
    search.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => { state.query = search.value; renderThumbs(); }, 120);
    });
  }

  addEventListener('hashchange', () => {
    const id = location.hash.replace('#', '');
    if (id && GRANITES.some(g => g.id === id)) select(id, { updateHash: false });
  });

  renderDetail();
  renderThumbs();
}

/* Granite | Monuments panels */
onClick('[data-tab]', el => {
  setPressed(qsa('[data-tab]'), x => x.dataset.tab === el.dataset.tab);
  qsa('[data-panel]').forEach(p => p.hidden = p.dataset.panel !== el.dataset.tab);
});

/* Monument gallery + lightbox */
const gallery = qs('[data-gallery]');
if (gallery) {
  gallery.innerHTML = MONUMENTS.map((m, i) => `
    <button type="button" data-i="${i}" aria-label="View monument ${i + 1} of ${MONUMENTS.length}">
      <picture>
        <source srcset="${esc(m.thumb.replace(/\.jpg$/, '.webp'))}" type="image/webp">
        <img src="${esc(m.thumb)}" alt="Granite monument ${i + 1}" loading="lazy" decoding="async">
      </picture>
    </button>`).join('');
  initLightbox('[data-lightbox]', MONUMENTS, { triggerSelector: '[data-gallery] [data-i]' });
}
