<?php

declare(strict_types=1);

get_header();

// The heading and the empty state are the post type's own labels, so the Site
// Owner's words for Trainers are declared once, in base-trainers.php.
$labels = get_post_type_object(BASE_TRAINER_POST_TYPE)->labels;
?>

<section class="wrap pt-12 pb-8">
    <h1 class="font-display text-3xl font-semibold tracking-tight">
        <?php echo esc_html(post_type_archive_title('', false)); ?>
    </h1>

    <?php if (have_posts()) : ?>
        <div data-trainers class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <?php while (have_posts()) : the_post(); ?>
                <?php get_template_part('template-parts/trainer-card'); ?>
            <?php endwhile; ?>
        </div>
    <?php else : ?>
        <p class="mt-10 text-lg text-ink-soft"><?php echo esc_html($labels->not_found); ?></p>
    <?php endif; ?>
</section>

<?php get_footer();
