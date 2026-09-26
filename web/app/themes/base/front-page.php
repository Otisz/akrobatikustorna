<?php

declare(strict_types=1);

get_header();

// Only a static front page carries editable content; a posts front page has none.
$front = get_option('show_on_front') === 'page'
    ? get_post((int) get_option('page_on_front'))
    : null;
$schedule = Base\page_link('edzeseink');
$apply = Base\page_link('jelentkezes');
$news = Base\page_link('hirek');
?>

<section class="mx-auto grid max-w-[74rem] items-center gap-10 px-5 pt-10 pb-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pt-16">
    <div>
        <h1 class="font-display text-3xl leading-[1.1] font-semibold tracking-tight text-balance">
            <?php bloginfo('name'); ?>
        </h1>

        <?php if ($tagline = get_bloginfo('description')) : ?>
            <p class="mt-6 max-w-[42ch] text-lg text-ink-soft"><?php echo esc_html($tagline); ?></p>
        <?php endif; ?>

        <?php if ($apply || $schedule) : ?>
            <div class="mt-9 flex flex-wrap gap-3">
                <?php if ($apply) : ?>
                    <a class="btn btn-primary" href="<?php echo esc_url($apply); ?>">
                        <?php esc_html_e('Jelentkezés', 'base'); ?>
                    </a>
                <?php endif; ?>
                <?php if ($schedule) : ?>
                    <a class="btn btn-secondary" href="<?php echo esc_url($schedule); ?>">
                        <?php esc_html_e('Edzéseink', 'base'); ?>
                    </a>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    </div>

    <div class="h-[22rem] overflow-hidden rounded-[var(--radius-card)] bg-surface sm:h-[26rem] lg:h-[29rem]">
        <?php echo Base\hero_image($front); ?>
    </div>
</section>

<?php if ($front instanceof WP_Post && trim($front->post_content) !== '') : ?>
    <section class="bg-surface py-20">
        <div class="entry-content mx-auto max-w-[74rem] px-5">
            <?php echo apply_filters('the_content', $front->post_content); ?>
        </div>
    </section>
<?php endif; ?>

<?php
$latest = new WP_Query([
    'post_type' => 'post',
    'posts_per_page' => 3,
    'ignore_sticky_posts' => true,
]);

// The grid holds exactly as many cells as there are Posts, so it never shows a gap.
$grid = [
    1 => 'max-w-[24rem]',
    2 => 'max-w-[52rem] sm:grid-cols-2',
    3 => 'sm:grid-cols-2 lg:grid-cols-3',
][min($latest->post_count, 3)] ?? '';
?>

<section class="mx-auto max-w-[74rem] px-5 py-20">
    <div class="flex flex-wrap items-baseline justify-between gap-4">
        <h2 class="font-display text-3xl font-semibold tracking-tight"><?php esc_html_e('Hírek', 'base'); ?></h2>
        <?php if ($news && $latest->have_posts()) : ?>
            <a class="font-display font-semibold text-brand-deep" href="<?php echo esc_url($news); ?>">
                <?php esc_html_e('Összes hír', 'base'); ?>
            </a>
        <?php endif; ?>
    </div>

    <?php if ($latest->have_posts()) : ?>
        <div class="mt-10 grid gap-8 <?php echo esc_attr($grid); ?>">
            <?php while ($latest->have_posts()) : $latest->the_post(); ?>
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
                        <h3 class="mt-1 font-display text-xl leading-snug font-semibold text-ink group-hover:text-brand-deep">
                            <?php the_title(); ?>
                        </h3>
                    </a>
                    <p class="mt-3 text-base text-ink-soft"><?php echo esc_html(get_the_excerpt()); ?></p>
                </article>
            <?php endwhile; ?>
        </div>
    <?php else : ?>
        <div class="mt-10 rounded-[var(--radius-card)] border-2 border-dashed border-line px-6 py-14 text-center">
            <p class="text-lg text-ink-soft"><?php esc_html_e('Még nincs közzétett hír.', 'base'); ?></p>
            <?php if (current_user_can('publish_posts')) : ?>
                <a class="btn btn-primary mt-6" href="<?php echo esc_url(admin_url('post-new.php')); ?>">
                    <?php esc_html_e('Első hír írása', 'base'); ?>
                </a>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</section>

<?php
wp_reset_postdata();
get_footer();
