<?php

/**
 * One Document on the listing: the whole row is the link, because its file is the
 * only thing a Document offers and a parent looking for a form should not have to
 * find a link inside the row.
 *
 * The `download` attribute saves the file rather than opening it in the browser's
 * own viewer, which is what a parent who came to fill a form in offline wants —
 * and what the outgoing site did.
 */

declare(strict_types=1);

$file = Base\document_file(get_the_ID());

// A Document whose file was deleted from the media library keeps the identifier
// of it, so the listing query cannot tell and hands the Document over anyway.
// This is where that one is dropped, rather than offered as a link to nothing.
if ($file === null) {
    return;
}
?>

<a id="<?php echo esc_attr(get_post_field('post_name')); ?>"
   class="group flex items-baseline justify-between gap-4 rounded-[var(--radius-card)] border border-line bg-paper px-5 py-4 no-underline hover:border-ink hover:bg-surface"
   href="<?php echo esc_url($file['url']); ?>"
   download="<?php echo esc_attr($file['name']); ?>">
    <span data-name class="font-display text-lg font-semibold text-ink group-hover:text-brand-deep">
        <?php the_title(); ?>
    </span>
    <span class="shrink-0 text-sm whitespace-nowrap text-ink-soft">
        <?php echo esc_html($file['size'] === null
            ? $file['extension']
            : sprintf('%s · %s', $file['extension'], $file['size'])); ?>
    </span>
</a>
