/** Articles index: topic filter, lead article, then the rest of the grid. */
import { ARTICLES, GRANITES } from '../data.js';
import { esc, qs, onClick, setPressed, qsa, mount } from '../core/dom.js';
import { articleCards, chips, thumbPicture } from '../components/cards.js';
import '../components/chrome.js';

const filterBar = qs('[data-filters]');
const featHost  = qs('[data-feature]');
const gridHost  = qs('[data-articles]');

let topic = 'All';

/* Each article borrows a stone photograph as a decorative lead image, spaced
   so neighbouring cards never repeat the same slab. */
const imageFor = i => GRANITES[(i * 3 + 2) % GRANITES.length];

const topics = ['All', ...new Set(ARTICLES.map(a => a.tag))];

function render() {
  const list = topic === 'All' ? ARTICLES : ARTICLES.filter(a => a.tag === topic);
  const [lead, ...rest] = list;

  featHost.hidden = !lead;
  if (lead) {
    featHost.innerHTML = `
      <div class="feature__img">
        ${thumbPicture({ src: imageFor(0).img, alt: '' })}
      </div>
      <div class="feature__body">
        <div class="meta"><span class="tag">${esc(lead.tag)}</span>
          <span class="when">${esc(lead.date)} · ${esc(lead.read)}</span></div>
        <h2 class="display display--block feature__title">${esc(lead.title)}</h2>
        <p class="feature__excerpt">${esc(lead.excerpt)}</p>
      </div>`;
  }
  gridHost.innerHTML = articleCards(rest, i => imageFor(i + 1));
}

filterBar.innerHTML = chips(topics, { active: topic, variant: 'chip--gold', attr: 'data-topic' });
onClick('[data-topic]', el => {
  topic = el.dataset.topic;
  setPressed(qsa('[data-topic]', filterBar), x => x.dataset.topic === topic);
  render();
}, filterBar);

render();
