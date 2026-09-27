<?php

/**
 * One Sponsor among the credits: the logo the organisation sent, with their name
 * under it, and the whole thing a link to their own site — which is what the club
 * promised them.
 *
 * The name is printed rather than left to the logo's alt text, because a logo is
 * often a wordmark a visitor cannot read at this size, and because it is the club's
 * own way of naming the organisation.
 */

declare(strict_types=1);

$url = Base\sponsor_url(get_the_ID());

// `contain` rather than `cover`: a logo cropped to fill a box is a logo the
// organisation would not recognise.
$logo = get_the_post_thumbnail(null, 'medium', [
    'class' => 'h-24 w-full rounded-[var(--radius-card)] bg-paper object-contain p-3',
    'alt' => '',
    'loading' => 'lazy',
]);

// The address field is required and the credits query asks for a logo, so this
// catches only a Sponsor written past the editing screen — or one whose logo was
// deleted from the media library afterwards, which leaves its identifier behind
// and passes that query. A credit with nothing to show, or leading nowhere, is
// left off rather than shown as a name on its own.
if ($url === null || $logo === '') {
    return;
}
?>

<li>
    <a data-sponsor
       class="group flex flex-col items-center gap-3 no-underline"
       href="<?php echo esc_url($url); ?>"
       target="_blank"
       rel="noreferrer">
        <?php echo $logo; ?>
        <span data-name class="text-center text-sm text-ink-soft group-hover:text-brand-deep">
            <?php the_title(); ?>
        </span>
    </a>
</li>
