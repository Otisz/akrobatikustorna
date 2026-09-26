<?php declare(strict_types=1); get_header(); ?>

<article class="wrap pt-12 pb-8">
    <h1 class="font-display text-3xl font-semibold tracking-tight text-balance"><?php the_title(); ?></h1>
</article>

<div class="entry-content wrap pb-8">
    <?php the_content(); ?>
</div>

<?php get_footer();
