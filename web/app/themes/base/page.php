<?php declare(strict_types=1); get_header(); ?>

<article class="wrap pt-12 pb-8">
    <h1 class="font-display text-3xl font-semibold tracking-tight text-balance"><?php the_title(); ?></h1>
</article>

<div class="entry-content wrap pb-8">
    <?php the_content(); ?>
</div>

<?php
// The Contact page carries the club's details and its map beneath whatever the
// Site Owner wrote. A template of its own would have to be named for the page's
// Hungarian slug, which is a visitor-facing string rather than a name for code.
if (Base\is_contact_page()) {
    get_template_part('template-parts/contact');
}
?>

<?php get_footer();
