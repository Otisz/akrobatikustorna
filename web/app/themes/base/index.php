<?php declare(strict_types=1); get_header(); ?>

<section class="wrap pt-12 pb-8">
    <h1 class="font-display text-3xl font-semibold tracking-tight">
        <?php echo esc_html(is_home() ? get_the_title(get_option('page_for_posts')) ?: __('Hírek', 'base') : get_the_archive_title()); ?>
    </h1>

    <?php if (have_posts()) : ?>
        <div class="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <?php while (have_posts()) : the_post(); ?>
                <?php get_template_part('template-parts/post-card'); ?>
            <?php endwhile; ?>
        </div>

        <div class="mt-14"><?php the_posts_pagination(['mid_size' => 1, 'class' => 'nav-list']); ?></div>
    <?php else : ?>
        <p class="mt-10 text-lg text-ink-soft"><?php esc_html_e('Nincs megjeleníthető tartalom.', 'base'); ?></p>
    <?php endif; ?>
</section>

<?php get_footer();
