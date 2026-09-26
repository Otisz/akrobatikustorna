<?php

/**
 * One Trainer in a listing: the portrait a parent recognises at the gym door,
 * the name, and what they do at the club.
 */

declare(strict_types=1);

$role = Base\trainer_role(get_the_ID());
?>

<article>
    <a class="group block no-underline" href="<?php the_permalink(); ?>">
        <?php if (has_post_thumbnail()) : ?>
            <div class="mb-4 aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-surface">
                <?php the_post_thumbnail('medium_large', [
                    'class' => 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]',
                    'loading' => 'lazy',
                ]); ?>
            </div>
        <?php endif; ?>
        <h2 class="font-display text-xl leading-snug font-semibold text-ink group-hover:text-brand-deep">
            <?php the_title(); ?>
        </h2>
    </a>
    <?php if ($role !== null) : ?>
        <p class="mt-1 text-base text-ink-soft"><?php echo esc_html($role); ?></p>
    <?php endif; ?>
</article>
