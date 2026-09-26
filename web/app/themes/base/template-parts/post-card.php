<?php

/**
 * One Post in a listing, shared by the news listing and the home page so the two
 * cannot drift apart.
 *
 * @var array{heading_tag?: string} $args
 */

declare(strict_types=1);

$heading_tag = ($args['heading_tag'] ?? 'h2') === 'h3' ? 'h3' : 'h2';
?>

<article>
    <a class="group block no-underline" href="<?php the_permalink(); ?>">
        <?php if (has_post_thumbnail()) : ?>
            <div class="mb-4 aspect-[3/2] overflow-hidden rounded-[var(--radius-card)] bg-surface">
                <?php the_post_thumbnail('medium_large', [
                    'class' => 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]',
                    'loading' => 'lazy',
                ]); ?>
            </div>
        <?php endif; ?>
        <p class="text-sm text-ink-soft"><?php echo esc_html(get_the_date()); ?></p>
        <<?php echo $heading_tag; ?> class="mt-1 font-display text-xl leading-snug font-semibold text-ink group-hover:text-brand-deep">
            <?php the_title(); ?>
        </<?php echo $heading_tag; ?>>
    </a>
    <p class="mt-3 text-base text-ink-soft"><?php echo esc_html(get_the_excerpt()); ?></p>
</article>
