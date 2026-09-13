/** Home: rotating hero of photographs, then a slice of the collection. */
import { HERO, GRANITES, STATS, HOME_BADGES, TRUST_STRIP } from '../data.js';
import { esc, qs, mount } from '../core/dom.js';
import { createCarousel } from '../core/carousel.js';
import { badgeList, statList, stoneCards } from '../components/cards.js';
import '../components/chrome.js';

const ROTATE_MS = 4200;
const FEATURED_COUNT = 6;

mount('[data-badges]',     badgeList(HOME_BADGES));
mount('[data-hero-stats]', badgeList(HOME_BADGES));
mount('[data-stats]',      statList(STATS));
mount('[data-featured]',   stoneCards(GRANITES.slice(0, FEATURED_COUNT)));
mount('[data-trust]',      TRUST_STRIP.map(t => `<li>${esc(t)}</li>`).join(''));

/* Every slide is { img, name, kicker, alt } — HERO in data.js resolves stone
   slides to that shape, so nothing here needs to know which kind a slide is. */
const frame = qs('[data-carousel]');
if (frame) {
  frame.innerHTML = `
    <div class="carousel__frame">
      ${HERO.map((h, i) => `
        <div class="carousel__slide" data-active="${i === 0}" role="img"${h.focus ? ` data-focus="${esc(h.focus)}"` : ''}
             aria-label="${esc(h.alt)}" data-src="${esc(h.img)}"></div>`).join('')}
      <div class="carousel__scrim"></div>
      <div class="carousel__caption">
        <div class="kicker" data-kicker>${esc(HERO[0].kicker)}</div>
        <div class="name" data-name>${esc(HERO[0].name)}</div>
      </div>
      <div class="carousel__dots" role="tablist" aria-label="Featured photographs">
        ${HERO.map((h, i) => `
          <button class="carousel__dot" type="button" role="tab" data-go="${i}"
                  aria-selected="${i === 0}" aria-label="Show ${esc(h.name)}"><i></i></button>`).join('')}
      </div>
      <div class="carousel__nav">
        <button type="button" data-prev aria-label="Previous photograph">&#8249;</button>
        <button type="button" data-next aria-label="Next photograph">&#8250;</button>
      </div>
    </div>
    <div class="corner-tr" aria-hidden="true"></div>
    <div class="corner-bl" aria-hidden="true"></div>`;

  const slides = [...frame.querySelectorAll('.carousel__slide')];

  /* Every full-size photograph used to download before the page had painted —
     hundreds of KB for images nobody had seen yet. Load the first immediately
     (the <head> preloads it) and the rest only when the browser is idle, or
     sooner if the slide is reached. image-set() lets the browser take the WebP
     and fall back to the JPEG. */
  const loaded = new Set();
  const loadSlide = i => {
    const el = slides[i];
    if (!el || loaded.has(i)) return;
    loaded.add(i);
    const jpg = el.dataset.src;
    const webp = jpg.replace(/\.(jpe?g|png)$/i, '.webp');
    el.style.backgroundImage =
      `image-set(url("${webp}") type("image/webp"), url("${jpg}"))`;
    // Safari < 17 and older Chrome need the unprefixed fallback declaration.
    if (!el.style.backgroundImage) el.style.backgroundImage = `url("${jpg}")`;
  };
  loadSlide(0);
  const idle = window.requestIdleCallback || (fn => setTimeout(fn, 1200));
  idle(() => HERO.forEach((_, i) => i && loadSlide(i)));
  const dots   = [...frame.querySelectorAll('.carousel__dot')];
  const kicker = qs('[data-kicker]', frame);
  const name   = qs('[data-name]', frame);

  createCarousel(frame, {
    count: HERO.length,
    interval: ROTATE_MS,
    onChange: i => {
      loadSlide(i);                       // in case it is reached before idle
      slides.forEach((el, n) => el.dataset.active = String(n === i));
      dots.forEach((el, n) => el.setAttribute('aria-selected', String(n === i)));
      kicker.textContent = HERO[i].kicker;
      name.textContent   = HERO[i].name;
    },
  });
}
