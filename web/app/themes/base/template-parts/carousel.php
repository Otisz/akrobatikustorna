<?php

/**
 * The home page carousel. Scroll snapping does the work, so the Slides can be
 * swiped or scrolled through with no JavaScript at all; the arrows are revealed
 * by `resources/js/app.js` once it can drive them.
 *
 * @var array{slides: WP_Query} $args The published Slides, already in the Site Owner's order.
 */

declare(strict_types=1);

$slides = $args['slides'];
$first = true;
?>

<div class="relative h-full w-full" data-carousel
     role="group" aria-roledescription="<?php esc_attr_e('diavetítés', 'base'); ?>"
     aria-label="<?php esc_attr_e('Képek a klub életéből', 'base'); ?>">
    <?php // The list is reset here: Tailwind's Preflight is not loaded, so a list carries its browser defaults. ?>
    <ul class="m-0 flex h-full w-full list-none snap-x snap-mandatory overflow-x-auto scroll-smooth p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        data-carousel-track>
        <?php while ($slides->have_posts()) : $slides->the_post(); ?>
            <?php $link = Base\slide_link(get_the_ID()); ?>
            <li class="relative h-full w-full shrink-0 grow-0 basis-full snap-center">
                <?php if ($link !== null) : ?>
                    <a class="block h-full w-full" href="<?php echo esc_url($link); ?>">
                <?php endif; ?>

                <?php
                    // The first Slide is the largest image above the fold, so it
                    // is fetched ahead of everything below it.
                    echo get_the_post_thumbnail(null, 'large', [
                        'class' => 'h-full w-full object-cover',
                        'fetchpriority' => $first ? 'high' : 'auto',
                        'loading' => $first ? 'eager' : 'lazy',
                    ]);
                ?>

                <?php if (get_the_title() !== '') : ?>
                    <p class="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/75 to-transparent px-5 pt-12 pb-5 font-display text-base font-medium text-paper">
                        <?php the_title(); ?>
                    </p>
                <?php endif; ?>

                <?php if ($link !== null) : ?>
                    </a>
                <?php endif; ?>
            </li>
            <?php $first = false; ?>
        <?php endwhile; ?>
        <?php wp_reset_postdata(); ?>
    </ul>

    <?php if ($slides->post_count > 1) : ?>
        <div class="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4">
            <?php
            $controls = [
                'previous' => ['M15 5l-7 7 7 7', __('Előző kép', 'base')],
                'next' => ['M9 5l7 7-7 7', __('Következő kép', 'base')],
            ];
            ?>
            <?php foreach ($controls as $direction => [$path, $label]) : ?>
                <button type="button" hidden
                        class="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-paper/85 text-ink shadow-sm transition hover:bg-paper"
                        data-carousel-control="<?php echo esc_attr($direction); ?>"
                        aria-label="<?php echo esc_attr($label); ?>">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="<?php echo esc_attr($path); ?>"/>
                    </svg>
                </button>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>
