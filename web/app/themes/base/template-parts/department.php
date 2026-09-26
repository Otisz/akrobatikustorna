<?php

/**
 * One Department, read in full on the listing rather than behind a link: the club
 * has a handful of Departments and a parent is comparing them to each other,
 * which is hard to do across several pages.
 */

declare(strict_types=1);

$picture = has_post_thumbnail();

// Sides alternate down the listing, so that the page does not read as one column
// of pictures beside one column of prose.
$picture_last = (int) ($args['position'] ?? 0) % 2 === 1;
?>

<article id="<?php echo esc_attr(get_post_field('post_name')); ?>"
         class="grid items-start gap-6 <?php echo $picture ? 'md:grid-cols-2 md:gap-12' : ''; ?>">
    <?php if ($picture) : ?>
        <div class="aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-surface <?php echo $picture_last ? 'md:order-2' : ''; ?>">
            <?php the_post_thumbnail('large', [
                'class' => 'h-full w-full object-cover',
                'loading' => 'lazy',
            ]); ?>
        </div>
    <?php endif; ?>

    <div>
        <h2 class="font-display text-2xl font-semibold tracking-tight text-balance"><?php the_title(); ?></h2>

        <div class="entry-content mt-4">
            <?php the_content(); ?>
        </div>
    </div>
</article>
