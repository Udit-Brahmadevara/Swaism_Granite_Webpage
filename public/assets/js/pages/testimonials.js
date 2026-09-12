/** Testimonials: client quotes, or an honest empty state when there are none. */
import { TESTIMONIALS, COMPANY } from '../data.js';
import { esc, qs } from '../core/dom.js';
import { quoteCards } from '../components/cards.js';
import '../components/chrome.js';

const host = qs('[data-testimonials]');

// Entries flagged `sample` are invented design copy (see data.js) and must never
// be published as if a client had said them.
const published = TESTIMONIALS.filter(t => !t.sample);

if (published.length) {
  host.innerHTML = quoteCards(published);
} else {
  host.dataset.empty = 'true';
  host.innerHTML = `
    <div class="card card--pad empty-state">
      <span class="quote__mark" aria-hidden="true">&ldquo;</span>
      <h2 class="display display--block">We're gathering these properly.</h2>
      <p class="prose">We'd rather publish nothing than publish invented praise. Written feedback
        from the fabricators, importers and contractors we work with will appear here once we have
        their sign-off to quote it.</p>
      <a class="btn btn--green" href="mailto:${esc(COMPANY.email)}">Share your experience</a>
    </div>`;
}
