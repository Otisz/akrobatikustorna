<?php

/**
 * One Recommended Page on the listing: the whole row is the link, because the
 * address is the only thing the entry offers and a visitor should not have to find
 * a link inside the row.
 *
 * It opens in a new tab, as the outgoing site's did: the visitor is being sent
 * somewhere the club does not own, and leaving the club's site behind is not what
 * they asked for.
 */

declare(strict_types=1);

$url = Base\recommended_page_url(get_the_ID());

// The field is required, so this catches only an entry written past the editing
// screen.
if ($url === null) {
    return;
}
?>

<a id="<?php echo esc_attr(get_post_field('post_name')); ?>"
   class="group flex items-baseline justify-between gap-4 rounded-[var(--radius-card)] border border-line bg-paper px-5 py-4 no-underline hover:border-ink hover:bg-surface"
   href="<?php echo esc_url($url); ?>"
   target="_blank"
   rel="noreferrer">
    <span data-name class="font-display text-lg font-semibold text-ink group-hover:text-brand-deep">
        <?php the_title(); ?>
    </span>
    <svg class="shrink-0 text-ink-soft" viewBox="0 0 24 24" width="18" height="18" fill="none"
         stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M7 17 17 7M9 7h8v8"/>
    </svg>
</a>
