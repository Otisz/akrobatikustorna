<?php declare(strict_types=1); get_header(); ?>

<article class="mx-auto max-w-[74rem] px-5 pt-12 pb-8">
    <p class="text-sm text-ink-soft"><?php echo esc_html(get_the_date()); ?></p>
    <h1 class="mt-2 max-w-[24ch] font-display text-3xl font-semibold tracking-tight text-balance"><?php the_title(); ?></h1>

    <?php if (has_post_thumbnail()) : ?>
        <div class="mt-8 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-surface">
            <?php the_post_thumbnail('large', ['class' => 'h-full w-full object-cover']); ?>
        </div>
    <?php endif; ?>
</article>

<div class="entry-content mx-auto max-w-[74rem] px-5 pb-8">
    <?php the_content(); ?>
</div>

<?php get_footer();
