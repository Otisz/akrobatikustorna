<?php declare(strict_types=1); get_header(); ?>

<section class="mx-auto max-w-[44rem] px-5 pt-20 pb-8">
    <h1 class="font-display text-3xl font-semibold tracking-tight"><?php esc_html_e('Nincs ilyen oldal', 'base'); ?></h1>
    <p class="mt-5 text-lg text-ink-soft">
        <?php esc_html_e('A keresett oldal megszűnt vagy átkerült máshová.', 'base'); ?>
    </p>
    <a class="btn btn-primary mt-8" href="<?php echo esc_url(home_url('/')); ?>">
        <?php esc_html_e('Vissza a kezdőlapra', 'base'); ?>
    </a>
</section>

<?php get_footer();
