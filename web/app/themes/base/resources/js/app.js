const toggle = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu.hidden = open;
  });
}

/*
 * The carousel scrolls and snaps on its own; this adds the arrows, which are
 * rendered hidden so that a visitor without JavaScript is never shown a control
 * that does nothing.
 */
document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('[data-carousel-track]');
  const controls = carousel.querySelectorAll('[data-carousel-control]');

  if (!track || controls.length === 0) {
    return;
  }

  controls.forEach((control) => {
    control.hidden = false;
    control.addEventListener('click', () => {
      const step = control.dataset.carouselControl === 'next' ? track.clientWidth : -track.clientWidth;
      const end = track.scrollWidth - track.clientWidth;
      const target = track.scrollLeft + step;

      // Wraps at either end, so the arrows never stop responding.
      let left = target;
      if (target < 0) left = end;
      if (target > end) left = 0;

      track.scrollTo({ left, behavior: 'smooth' });
    });
  });
});
