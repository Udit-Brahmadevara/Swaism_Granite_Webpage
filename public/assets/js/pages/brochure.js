/** Brochure: what the PDF contains. Swap in the real file when it exists. */
import { BROCHURE_CONTENTS } from '../data.js';
import { esc, mount } from '../core/dom.js';
import '../components/chrome.js';

mount('[data-contents]', BROCHURE_CONTENTS.map(c =>
  `<li class="tick">${esc(c)}</li>`).join(''));
