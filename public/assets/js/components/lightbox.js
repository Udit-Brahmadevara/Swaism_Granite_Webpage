/**
 * Full-screen image viewer built on <dialog>.
 *
 * Given a list of images and a trigger selector, handles opening, prev/next,
 * wrapping, keyboard arrows and backdrop dismissal. The browser's own dialog
 * gives us focus trapping and Escape for free.
 */
import { esc, qs, qsa } from '../core/dom.js';

export function initLightbox(dialogSelector, items, { triggerSelector } = {}) {
  const box = qs(dialogSelector);
  if (!box || !items.length) return null;

  const img   = qs('img', box);
  const count = qs('[data-count]', box);
  let at = 0;

  const paint = () => {
    img.src = items[at].full;
    img.alt = items[at].alt || `Image ${at + 1} of ${items.length}`;
    if (count) count.textContent = `${at + 1} / ${items.length}`;
  };
  const step = d => { at = (at + d + items.length) % items.length; paint(); };
  const open = i => { at = i; paint(); box.showModal(); };

  if (triggerSelector) {
    qsa(triggerSelector).forEach(el => el.addEventListener('click', () => open(Number(el.dataset.i))));
  }
  qs('[data-close]', box)?.addEventListener('click', () => box.close());
  qs('[data-prev]',  box)?.addEventListener('click', () => step(-1));
  qs('[data-next]',  box)?.addEventListener('click', () => step(1));
  box.addEventListener('click', e => { if (e.target === box) box.close(); });
  box.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); step(-1); }
  });

  return { open, step };
}
