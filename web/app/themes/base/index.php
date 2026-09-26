<?php declare(strict_types=1); get_header(); ?>

<section class="mx-auto max-w-[74rem] px-5 pt-12 pb-8">
    <h1 class="font-display text-3xl font-semibold tracking-tight">
        <?php echo esc_html(is_home() ? get_the_title(get_option('page_for_posts')) ?: __('Hírek', 'base') : get_the_archive_title()); ?>
    </h1>

    <?php if (have_posts()) : ?>
        <div class="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <?php while (have_posts()) : the_post(); ?>
                <article class="reveal">
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
                        <h2 class="mt-1 font-display text-xl leading-snug font-semibold text-ink group-hover:text-brand-deep">
                            <?php the_title(); ?>
                        </h2>
                    </a>
                    <p class="mt-3 text-base text-ink-soft"><?php echo esc_html(get_the_excerpt()); ?></p>
                </article>
            <?php endwhile; ?>
        </div>

        <div class="mt-14"><?php the_posts_pagination(['mid_size' => 1, 'class' => 'nav-list']); ?></div>
    <?php else : ?>
        <p class="mt-10 text-lg text-ink-soft"><?php esc_html_e('Nincs megjeleníthető tartalom.', 'base'); ?></p>
    <?php endif; ?>
</section>

<?php get_footer();
