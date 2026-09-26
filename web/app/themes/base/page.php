<?php declare(strict_types=1); get_header(); ?>

<article class="mx-auto max-w-[74rem] px-5 pt-12 pb-8">
    <h1 class="font-display text-3xl font-semibold tracking-tight text-balance"><?php the_title(); ?></h1>
</article>

<div class="entry-content mx-auto max-w-[74rem] px-5 pb-8">
    <?php the_content(); ?>
</div>

<?php get_footer();
