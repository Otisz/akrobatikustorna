<?php

declare(strict_types=1);

get_header();

// Only a static front page carries editable content; a posts front page has none.
$front = get_option('show_on_front') === 'page'
    ? get_post((int) get_option('page_on_front'))
    : null;
$schedule = Base\page_link('edzeseink');
$apply = Base\page_link('jelentkezes');
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
        <?php echo Base\front_page_image($front); ?>
    </div>
</section>

<?php if ($front instanceof WP_Post && trim($front->post_content) !== '') : ?>
    <section class="bg-surface py-20">
        <div class="entry-content wrap">
            <?php echo apply_filters('the_content', $front->post_content); ?>
        </div>
    </section>
<?php endif; ?>

<?php get_footer();
