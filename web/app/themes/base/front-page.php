<?php

declare(strict_types=1);

get_header();

// Only a static front page carries editable content; a posts front page has none.
$front = get_option('show_on_front') === 'page'
    ? get_post((int) get_option('page_on_front'))
    : null;
$schedule = Base\page_link('edzeseink');
$apply = Base\page_link('jelentkezes');
$news_page = Base\news_link();
// post_status is spelled out because WP_Query would otherwise add the signed-in
// Site Owner's own private posts to what is a public listing.
$slides = Base\slides();
$sponsors = Base\sponsors();
$news = new WP_Query([
    'posts_per_page' => 3,
    'post_status' => 'publish',
    'ignore_sticky_posts' => true,
    'no_found_rows' => true,
]);
?>

<section class="wrap grid items-center gap-10 pt-10 pb-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pt-16">
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
        <?php if ($slides->have_posts()) : ?>
            <?php get_template_part('template-parts/carousel', null, ['slides' => $slides]); ?>
        <?php else : ?>
            <?php echo Base\front_page_image($front); ?>
        <?php endif; ?>
    </div>
</section>

<?php if ($front instanceof WP_Post && trim($front->post_content) !== '') : ?>
    <section class="bg-surface py-20">
        <div class="entry-content wrap">
            <?php echo apply_filters('the_content', $front->post_content); ?>
        </div>
    </section>
<?php endif; ?>

<?php if ($news->have_posts()) : ?>
    <section class="wrap py-20">
        <div class="flex flex-wrap items-end justify-between gap-4">
            <h2 class="font-display text-2xl font-semibold tracking-tight"><?php esc_html_e('Hírek', 'base'); ?></h2>
            <?php if ($news_page) : ?>
                <a class="btn btn-secondary" href="<?php echo esc_url($news_page); ?>">
                    <?php esc_html_e('Összes hír', 'base'); ?>
                </a>
            <?php endif; ?>
        </div>

        <div class="mt-10 grid gap-8 md:grid-cols-3">
            <?php while ($news->have_posts()) : $news->the_post(); ?>
                <?php get_template_part('template-parts/post-card', null, ['heading_tag' => 'h3']); ?>
            <?php endwhile; ?>
            <?php wp_reset_postdata(); ?>
        </div>
    </section>
<?php endif; ?>

<?php // The credits close the home page, as they did on the outgoing site: a parent reads about the club first, and its Sponsors last. ?>
<?php if ($sponsors->have_posts()) : ?>
    <section class="bg-surface py-20">
        <div class="wrap">
            <h2 class="text-center font-display text-2xl font-semibold tracking-tight">
                <?php esc_html_e('Támogatóink', 'base'); ?>
            </h2>

            <?php // The list is reset here: Tailwind's Preflight is not loaded, so a list carries its browser defaults. ?>
            <ul data-sponsors class="mx-auto mt-12 grid max-w-4xl list-none grid-cols-2 items-start gap-8 p-0 sm:grid-cols-3 lg:grid-cols-4">
                <?php while ($sponsors->have_posts()) : $sponsors->the_post(); ?>
                    <?php get_template_part('template-parts/sponsor'); ?>
                <?php endwhile; ?>
                <?php wp_reset_postdata(); ?>
            </ul>
        </div>
    </section>
<?php endif; ?>

<?php get_footer();
