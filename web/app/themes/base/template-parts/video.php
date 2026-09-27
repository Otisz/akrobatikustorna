<?php

/**
 * One Video in the gallery: the recording's own thumbnail under a play control,
 * which `resources/js/app.js` turns into the player where it stands. Until that
 * script can take over, the control is an ordinary link to YouTube, so a visitor
 * without JavaScript is offered the recording rather than a dead button.
 */

declare(strict_types=1);

$video = Base\video_identifier(get_the_ID());

// A Video the Site Owner has yet to paste a link into is dropped by the gallery
// query; this catches one written past the editing screen.
if ($video === null) {
    return;
}

$title = get_the_title();
?>

<li id="<?php echo esc_attr(get_post_field('post_name')); ?>" data-video="<?php echo esc_attr($video); ?>">
    <a class="group relative block aspect-video overflow-hidden rounded-[var(--radius-card)] bg-ink no-underline"
       href="<?php echo esc_url(base_video_url($video)); ?>"
       data-video-play
       data-video-title="<?php echo esc_attr($title); ?>"
       aria-label="<?php echo esc_attr(sprintf(__('%s lejátszása', 'base'), $title)); ?>">
        <?php // YouTube's own still of the recording, so the Site Owner has no picture to choose. ?>
        <img src="https://i.ytimg.com/vi/<?php echo esc_attr($video); ?>/hqdefault.jpg"
             class="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
             width="480" height="360" alt="" loading="lazy">
        <span class="absolute inset-0 grid place-items-center">
            <span class="grid h-16 w-16 place-items-center rounded-full bg-paper/85 text-ink shadow-sm transition group-hover:bg-paper">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            </span>
        </span>
    </a>
    <h2 data-name class="mt-4 font-display text-xl leading-snug font-semibold text-ink">
        <?php echo esc_html($title); ?>
    </h2>
</li>
