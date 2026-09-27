<?php

declare(strict_types=1);

get_header();

// The heading and the empty state are the post type's own labels, so the Site
// Owner's word for the gallery is declared once, in base-videos.php.
$labels = get_post_type_object(BASE_VIDEO_POST_TYPE)->labels;
?>

<section class="wrap pt-12 pb-8">
    <h1 class="font-display text-3xl font-semibold tracking-tight">
        <?php echo esc_html(post_type_archive_title('', false)); ?>
    </h1>

    <?php if (have_posts()) : ?>
        <?php // The list is reset here: Tailwind's Preflight is not loaded, so a list carries its browser defaults. ?>
        <ul class="mt-10 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-2">
            <?php while (have_posts()) : the_post(); ?>
                <?php get_template_part('template-parts/video'); ?>
            <?php endwhile; ?>
        </ul>
    <?php else : ?>
        <p class="mt-10 text-lg text-ink-soft"><?php echo esc_html($labels->not_found); ?></p>
    <?php endif; ?>
</section>

<?php get_footer();
