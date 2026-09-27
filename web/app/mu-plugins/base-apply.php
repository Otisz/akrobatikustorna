<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — Apply
 * Description: The Apply page at /jelentkezes, carrying the Google Form a parent fills in to enrol a child. The club takes no applications any other way, so the form is the page.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** The path the outgoing site published its application form under. */
const BASE_APPLY_SLUG = 'jelentkezes';

/** Which page is the Apply page, so that the slug can be held to it afterwards. */
const BASE_APPLY_PAGE_OPTION = 'base_apply_page';

/**
 * The club's application form, as the outgoing site carried it. Initial content
 * only, written once: the form is the Site Owner's to replace — a new season may
 * well want a new one — and they replace it by pasting the new address over this
 * one.
 *
 * The address stands in a paragraph of its own, which is what `base-google-forms.php`
 * turns into the form. Nothing here knows about frames, and neither does the Site
 * Owner.
 */
function base_apply_initial_content(): string
{
    return <<<HTML
    <!-- wp:paragraph -->
    <p>Töltsd ki az alábbi jelentkezési lapot, és felvesszük veled a kapcsolatot az első próbaedzés időpontjáról.</p>
    <!-- /wp:paragraph -->

    <!-- wp:paragraph -->
    <p>https://docs.google.com/forms/d/e/1FAIpQLScuoLL1rYrgj1ohglnjoGDWRKFCPaCMdUhJ3zs96EXm4tytWw/viewform</p>
    <!-- /wp:paragraph -->
    HTML;
}

/**
 * Publishes the Apply page and holds it at its slug — see `base-pages.php` for
 * what that means for a page the site's structure depends on. The header and the
 * home page both offer the way to apply, and both go quiet until this page exists.
 */
add_action('init', static function (): void {
    base_structural_page(
        BASE_APPLY_PAGE_OPTION,
        BASE_APPLY_SLUG,
        __('Jelentkezés', 'base'),
        'base_apply_initial_content'
    );
}, 20);
