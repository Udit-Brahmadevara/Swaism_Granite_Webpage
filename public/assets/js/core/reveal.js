/**
 * Scroll reveal: elements fade and rise into place the first time they enter
 * the viewport, staggered by their position among siblings (see site.css).
 *
 * The hidden state is applied here, by script, so a visitor without JavaScript
 * (or a crawler) always sees the content. Reduced motion needs nothing extra:
 * the global rule in site.css makes the transition instant.
 */
export function reveal(elements) {
  const els = [...elements];
  if (!els.length || !('IntersectionObserver' in window)) return;

  // Once in place, drop the attribute so the stagger delay stops applying to
  // later transitions such as hover.
  const settle = el => el.removeAttribute('data-reveal');

  els.forEach(el => { el.dataset.reveal = 'pending'; });
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    e.target.dataset.reveal = 'in';
    e.target.addEventListener('transitionend', () => settle(e.target), { once: true });
    setTimeout(() => settle(e.target), 1500);   // in case no transition runs
  }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}
