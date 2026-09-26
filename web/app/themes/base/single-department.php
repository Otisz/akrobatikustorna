<?php

/**
 * A Department being previewed before it is published. A published Department is
 * read on the listing and its own URL (Uniform Resource Locator) redirects there
 * — see base-departments.php — so this template is what the Site Owner checks a
 * draft against, and nothing a visitor reaches.
 */

declare(strict_types=1);

get_header();

$departments = get_post_type_archive_link(BASE_DEPARTMENT_POST_TYPE);
?>

<article class="wrap pt-12 pb-8">
    <h1 class="font-display text-3xl font-semibold tracking-tight text-balance"><?php the_title(); ?></h1>

    <?php if (has_post_thumbnail()) : ?>
        <div class="mt-8 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-surface">
            <?php the_post_thumbnail('large', ['class' => 'h-full w-full object-cover']); ?>
        </div>
    <?php endif; ?>

    <div class="entry-content mt-8">
        <?php the_content(); ?>
    </div>

    <?php if (is_string($departments)) : ?>
        <a class="btn btn-secondary mt-10" href="<?php echo esc_url($departments); ?>">
            <?php esc_html_e('Összes szakosztály', 'base'); ?>
        </a>
    <?php endif; ?>
</article>

<?php get_footer();
