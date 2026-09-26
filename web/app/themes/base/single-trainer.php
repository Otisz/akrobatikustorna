<?php

declare(strict_types=1);

get_header();

$role = Base\trainer_role(get_the_ID());
$trainers = get_post_type_archive_link(BASE_TRAINER_POST_TYPE);
?>

<article class="wrap grid gap-10 pt-12 pb-8 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-14">
    <?php if (has_post_thumbnail()) : ?>
        <div class="aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-surface">
            <?php the_post_thumbnail('large', ['class' => 'h-full w-full object-cover']); ?>
        </div>
    <?php endif; ?>

    <div>
        <h1 class="font-display text-3xl font-semibold tracking-tight text-balance"><?php the_title(); ?></h1>

        <?php if ($role !== null) : ?>
            <p class="mt-2 text-lg text-ink-soft"><?php echo esc_html($role); ?></p>
        <?php endif; ?>

        <div class="entry-content mt-8">
            <?php the_content(); ?>
        </div>

        <?php if (is_string($trainers)) : ?>
            <a class="btn btn-secondary mt-10" href="<?php echo esc_url($trainers); ?>">
                <?php esc_html_e('Összes edző', 'base'); ?>
            </a>
        <?php endif; ?>
    </div>
</article>

<?php get_footer();
