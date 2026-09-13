/** About: company figures, values, plant capabilities and the export map. */
import { STATS, VALUES, CAPABILITIES, FACILITY } from '../data.js';
import { esc, qs, qsa, mount } from '../core/dom.js';
import { createCarousel } from '../core/carousel.js';
import { reveal } from '../core/reveal.js';
import { statList, productCards, valueCards } from '../components/cards.js';
import { initWorldMap } from '../components/world-map.js';
import '../components/chrome.js';

const FACILITY_ROTATE_MS = 5200;

mount('[data-stats]',   statList(STATS, { tone: 'light' }));
mount('[data-values]',  valueCards(VALUES));
mount('[data-capabilities]', productCards(CAPABILITIES));
reveal(qsa('[data-capabilities] > *'));

const plant = qs('[data-plant]');
if (plant) {
  plant.innerHTML = `
    ${FACILITY.map((f, i) => {
      /* The frame renders about 640px wide, so the grid-size copy is the right
         file — the display-size original was ~246KB each, four of them. */
      const small = f.img.replace(/\/([^/]+)$/, '/thumbs/$1');
      return `
      <picture class="plant__slide" data-active="${i === 0}"${f.focus ? ` data-focus="${esc(f.focus)}"` : ''}>
        <source srcset="${esc(small.replace(/\.jpg$/, '.webp'))}" type="image/webp">
        <img src="${esc(small)}" alt="${esc(f.alt)}"
             ${i ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">
      </picture>`;
    }).join('')}
    <span class="plant__scrim" aria-hidden="true"></span>
    <figcaption class="plant__caption" data-caption>${esc(FACILITY[0].caption)}</figcaption>
    <div class="plant__dots" role="tablist" aria-label="Facility photographs">
      ${FACILITY.map((f, i) => `
        <button type="button" role="tab" data-go="${i}" aria-selected="${i === 0}"
                aria-label="Show: ${esc(f.caption)}"></button>`).join('')}
    </div>
    <div class="plant__nav">
      <button type="button" data-prev aria-label="Previous photograph">&#8249;</button>
      <button type="button" data-next aria-label="Next photograph">&#8250;</button>
    </div>`;

  const slides  = [...plant.querySelectorAll('.plant__slide')];
  const dots    = [...plant.querySelectorAll('[data-go]')];
  const caption = qs('[data-caption]', plant);

  createCarousel(plant, {
    count: FACILITY.length,
    interval: FACILITY_ROTATE_MS,
    onChange: i => {
      slides.forEach((el, n) => el.dataset.active = String(n === i));
      dots.forEach((el, n) => el.setAttribute('aria-selected', String(n === i)));
      caption.textContent = FACILITY[i].caption;
    },
  });
}

initWorldMap('[data-worldmap]');
