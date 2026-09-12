/**
 * Export-markets world map (About page).
 *
 * The geometry is pre-rendered — `tools/bake-map.py` projects the Natural Earth
 * atlas once and commits assets/img/world-map.svg. At runtime this module only
 * fetches that file and wires up interaction, so the page no longer pulls d3,
 * topojson-client and a 100KB atlas from a CDN (~200KB across three requests to
 * a third-party origin) just to draw a fixed map of a fixed set of markets.
 *
 * Country fills come from CSS, driven by `data-active` on the wrapper.
 */
import { MARKETS } from '../data.js';
import { esc, qs, qsa } from '../core/dom.js';

const MAP_SRC = '/assets/img/world-map.svg';

export async function initWorldMap(selector) {
  const host = qs(selector);
  if (!host) return;

  host.innerHTML = `
    <div class="worldmap">
      <div class="worldmap__canvas" data-canvas></div>
      <div class="worldmap__panel" data-panel></div>
    </div>`;
  const canvas = qs('[data-canvas]', host);
  const panel  = qs('[data-panel]', host);

  // country name -> market
  const lookup = {};
  MARKETS.forEach(m => m.countries.forEach(c => { lookup[c] = m.key; }));
  let selected = MARKETS[0].key;

  const renderPanel = () => {
    const m = MARKETS.find(x => x.key === selected);
    panel.innerHTML = `
      <div class="chips worldmap__chips">
        ${MARKETS.map(x => `<button class="chip chip--gold" type="button" data-key="${esc(x.key)}"
            aria-pressed="${x.key === selected}">${esc(x.name)}</button>`).join('')}
      </div>
      <div class="worldmap__body">
        <div class="label worldmap__since">${esc(m.since)}</div>
        <h3>${esc(m.name)}</h3>
        <div class="worldmap__lead">${esc(m.lead)}</div>
        <p>${esc(m.body)}</p>
        <ul class="worldmap__facts">${m.facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
      </div>`;
    qsa('[data-key]', panel).forEach(b =>
      b.addEventListener('click', () => select(b.dataset.key)));
  };

  const paint = () => {
    canvas.dataset.active = selected;
    qsa('[data-market]', canvas).forEach(g =>
      g.classList.toggle('is-active', g.dataset.market === selected));
  };

  const select = key => { selected = key; paint(); renderPanel(); };

  let svg;
  try {
    svg = await fetch(MAP_SRC).then(r => {
      if (!r.ok) throw new Error(String(r.status));
      return r.text();
    });
  } catch {
    // Offline or the file is missing: the panel alone still communicates the
    // markets, so drop the canvas rather than leave an empty box.
    canvas.remove();
    qs('.worldmap', host).classList.add('worldmap--no-canvas');
    renderPanel();
    return;
  }

  canvas.innerHTML = svg;
  // Tag each country with the market it belongs to; CSS does the colouring.
  qsa('path[data-country]', canvas).forEach(p => {
    const key = lookup[p.dataset.country];
    if (key) {
      p.dataset.market = key;
      p.setAttribute('tabindex', '0');
      p.setAttribute('role', 'button');
      p.setAttribute('aria-label', p.dataset.country);
      p.addEventListener('click', () => select(key));
      p.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(key); }
      });
    }
  });
  qsa('.worldmap__marker', canvas).forEach(g =>
    g.addEventListener('click', () => select(g.dataset.market)));

  select(selected);
}
