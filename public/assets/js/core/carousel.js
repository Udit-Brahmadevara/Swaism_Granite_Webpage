/**
 * Slide rotator shared by the home hero and the About facility gallery.
 *
 * Owns only timing, index and input wiring — never markup. The caller renders
 * its own slides and supplies `onChange(index)` to paint them, so two very
 * different-looking carousels can share one set of behaviours:
 *
 *   - autoplay, paused on hover, on keyboard focus, and while the tab is hidden
 *   - prev / next / dot controls, discovered by data attribute
 *   - left & right arrow keys when the carousel has focus
 *   - horizontal swipe on touch devices
 *   - honours prefers-reduced-motion by not auto-advancing at all
 *
 * Markup contract (all optional):
 *   [data-go="<i>"]  a dot or thumbnail that jumps to slide i
 *   [data-prev]      previous control
 *   [data-next]      next control
 */
export function createCarousel(root, { count, interval = 4200, onChange }) {
  if (!root || !count) return null;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0, timer = null, paused = false;

  const clamp = i => (i % count + count) % count;

  function show(i) {
    index = clamp(i);
    onChange(index);
  }

  function start() {
    clearInterval(timer);
    if (reduced || count < 2) return;      // a single slide never rotates
    timer = setInterval(() => { if (!paused) show(index + 1); }, interval);
  }

  /** Jump to a slide and restart the clock, so a click always gets full dwell. */
  function go(i) { show(i); start(); }

  root.querySelectorAll('[data-go]').forEach(el =>
    el.addEventListener('click', () => go(Number(el.dataset.go))));
  root.querySelector('[data-prev]')?.addEventListener('click', () => go(index - 1));
  root.querySelector('[data-next]')?.addEventListener('click', () => go(index + 1));

  const pause  = () => { paused = true; };
  const resume = () => { paused = false; };
  root.addEventListener('mouseenter', pause);
  root.addEventListener('mouseleave', resume);
  root.addEventListener('focusin', pause);
  root.addEventListener('focusout', resume);
  document.addEventListener('visibilitychange', () => { paused = document.hidden; });

  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); go(index - 1); }
  });

  /* Swipe. Pointer events cover touch and pen; the 45px threshold and the
     2:1 horizontal bias stop a vertical page scroll registering as a swipe. */
  const SWIPE_MIN = 45;
  let startX = 0, startY = 0, tracking = false;
  root.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse') return;
    tracking = true; startX = e.clientX; startY = e.clientY; paused = true;
  }, { passive: true });
  root.addEventListener('pointerup', e => {
    if (!tracking) return;
    tracking = false; paused = false;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > Math.abs(dy) * 2) {
      go(index + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
  root.addEventListener('pointercancel', () => { tracking = false; paused = false; }, { passive: true });

  show(0);
  start();

  return { go, stop: () => clearInterval(timer), get index() { return index; } };
}
