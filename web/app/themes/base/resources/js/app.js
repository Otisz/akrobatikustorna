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

/*
 * A gallery Video is a thumbnail until a visitor asks for it; this is what
 * swaps in the player, in place, so that watching a recording never leaves the
 * site and a gallery of a dozen competitions loads none of them unasked. The
 * control is a link to YouTube in the markup, so a visitor without JavaScript is
 * offered the recording rather than a dead button.
 */
document.querySelectorAll('[data-video]').forEach((video) => {
  const play = video.querySelector('[data-video-play]');

  if (!play) {
    return;
  }

  play.addEventListener('click', (event) => {
    event.preventDefault();

    const player = document.createElement('iframe');

    // The no-cookie host, because a visitor who pressed play asked to watch a
    // recording rather than to be measured.
    player.src = `https://www.youtube-nocookie.com/embed/${video.dataset.video}?autoplay=1&rel=0`;
    player.title = play.dataset.videoTitle ?? '';
    player.className = 'block aspect-video w-full rounded-[var(--radius-card)] border-0 bg-ink';
    player.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    player.allowFullscreen = true;

    play.replaceWith(player);
  });
});
