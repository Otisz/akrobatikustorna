<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — Recommended Pages
 * Description: The Recommended Page content type at /ajanlott-oldalak: the organisations the club points visitors towards, each a name and an address. Registered in a must-use plugin rather than in the theme, because the club's outbound links must outlive any theme.
 */

if (!defined('ABSPATH')) {
    exit;
}

const BASE_RECOMMENDED_PAGE_POST_TYPE = 'recommended_page';

/** The path the outgoing site published the club's outbound links under. */
const BASE_RECOMMENDED_PAGE_SLUG = 'ajanlott-oldalak';

/** The organisation's own address, which is the whole point of the entry. */
const BASE_RECOMMENDED_PAGE_URL_META = 'recommended_page_url';

/**
 * The order Recommended Pages are listed in. Alphabetical, as the outgoing site
 * listed them: the list is scanned for a name rather than read through, and it is
 * the one order that asks the Site Owner to maintain nothing.
 */
const BASE_RECOMMENDED_PAGE_ORDER = ['title' => 'ASC'];

add_action('init', static function (): void {
    register_post_type(BASE_RECOMMENDED_PAGE_POST_TYPE, [
        'labels' => [
            'name' => __('Ajánlott oldalak', 'base'),
            'singular_name' => __('Ajánlott oldal', 'base'),
            'add_new' => __('Új ajánlott oldal', 'base'),
            'add_new_item' => __('Új ajánlott oldal hozzáadása', 'base'),
            'edit_item' => __('Ajánlott oldal szerkesztése', 'base'),
            'new_item' => __('Új ajánlott oldal', 'base'),
            'view_item' => __('Ajánlott oldal megtekintése', 'base'),
            'search_items' => __('Ajánlott oldalak keresése', 'base'),
            'not_found' => __('Nincs ajánlott oldal', 'base'),
            'not_found_in_trash' => __('A lomtárban nincs ajánlott oldal', 'base'),
            'all_items' => __('Ajánlott oldalak', 'base'),
            'menu_name' => __('Ajánlott oldalak', 'base'),
            'archives' => __('Ajánlott oldalak', 'base'),
        ],
        'public' => true,
        // `with_front` off, because the permalink structure puts every post under
        // /hirek and a Recommended Page is not news.
        'rewrite' => ['slug' => BASE_RECOMMENDED_PAGE_SLUG, 'with_front' => false],
        'has_archive' => BASE_RECOMMENDED_PAGE_SLUG,
        'show_in_nav_menus' => true,
        'menu_position' => 27,
        'menu_icon' => 'dashicons-admin-links',
        // A Recommended Page is its name and its address, and nothing else: no
        // body to write, no picture, no number to order it by. Withholding
        // `editor` also settles which editing screen this is — WordPress opens the
        // block editor only for a post type with a body — so the Site Owner gets a
        // short form of the two things a Recommended Page is.
        'supports' => ['title'],
        // Mapped to the `post` capabilities, so the Editor role the Site Owner
        // holds governs Recommended Pages as it governs everything else.
        'capability_type' => 'post',
        'map_meta_cap' => true,
    ]);

    register_post_meta(BASE_RECOMMENDED_PAGE_POST_TYPE, BASE_RECOMMENDED_PAGE_URL_META, [
        'single' => true,
        'type' => 'string',
        'sanitize_callback' => 'sanitize_url',
        'show_in_rest' => false,
    ]);
});

/**
 * The field the Site Owner fills the address in. Declared in code rather than in
 * the field editor, because the Site Owner cannot reach that screen and a field
 * group kept only in the database would not survive a fresh install.
 *
 * In the main column rather than the sidebar, because the address *is* the entry.
 * Required for the same reason a Document's file is: a recommendation a visitor
 * cannot follow is not a recommendation.
 */
add_action('acf/init', static function (): void {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group([
        'key' => 'group_base_recommended_page',
        'title' => __('Ajánlott oldal', 'base'),
        'fields' => [
            [
                'key' => 'field_base_recommended_page_url',
                'label' => __('Cím', 'base'),
                'name' => BASE_RECOMMENDED_PAGE_URL_META,
                'type' => 'url',
                'required' => 1,
                'instructions' => __('Ide jut a látogató, ha az ajánlott oldalra kattint.', 'base'),
            ],
        ],
        'location' => [
            [
                ['param' => 'post_type', 'operator' => '==', 'value' => BASE_RECOMMENDED_PAGE_POST_TYPE],
            ],
        ],
        'position' => 'normal',
        'active' => true,
    ]);
});

/**
 * Lists Recommended Pages in the admin in the order a visitor scans them in, so
 * that the list reads as the listing does.
 */
add_action('pre_get_posts', static function (WP_Query $query): void {
    if (!is_admin() || !$query->is_main_query() || $query->get('post_type') !== BASE_RECOMMENDED_PAGE_POST_TYPE) {
        return;
    }

    if ($query->get('orderby') === '') {
        $query->set('orderby', BASE_RECOMMENDED_PAGE_ORDER);
    }
});

/**
 * Holds the public listing to that same order, whole: a club points visitors at
 * few enough organisations that paginating them would only hide one.
 *
 * An entry with no address is left off, because a row that leads nowhere is worse
 * than no row. The field is required, so the only entries this drops are ones
 * written past the editing screen — imported, or made by WP-CLI (WordPress
 * Command Line Interface).
 */
add_action('pre_get_posts', static function (WP_Query $query): void {
    if (is_admin() || !$query->is_main_query() || !$query->is_post_type_archive(BASE_RECOMMENDED_PAGE_POST_TYPE)) {
        return;
    }

    $query->set('orderby', BASE_RECOMMENDED_PAGE_ORDER);
    $query->set('posts_per_page', -1);
    $query->set('meta_query', [
        // Spelled out as a comparison rather than `EXISTS`, because an address
        // cleared after it was saved leaves the meta row behind with nothing in it.
        ['key' => BASE_RECOMMENDED_PAGE_URL_META, 'value' => '', 'compare' => '!='],
    ]);
});

/**
 * A Recommended Page is followed from the listing, which is the one public address
 * the content model gives it, so its own URL (Uniform Resource Locator) carries a
 * visitor there — to its place on that page — rather than standing up a page that
 * holds nothing the listing does not already offer.
 *
 * Deliberately not a redirect to the organisation's own site, which would hand
 * this site's address to a page it does not own.
 *
 * A preview is not exempted, as a Department's is, and for the reason a Document's
 * is not: the editing screen already shows the address back, and the Site Owner
 * can follow it.
 */
add_action('template_redirect', static function (): void {
    if (!is_singular(BASE_RECOMMENDED_PAGE_POST_TYPE)) {
        return;
    }

    $listing = get_post_type_archive_link(BASE_RECOMMENDED_PAGE_POST_TYPE);

    if (!is_string($listing)) {
        return;
    }

    wp_safe_redirect($listing . '#' . get_post_field('post_name'), 301);
    exit;
});

/**
 * Prints each entry's address in the admin list, beside its name: it is the whole
 * of what the entry does, and an entry missing it is only visible here.
 */
add_filter('manage_' . BASE_RECOMMENDED_PAGE_POST_TYPE . '_posts_columns', static function (array $columns): array {
    $before = array_slice($columns, 0, 2, true);
    $after = array_slice($columns, 2, null, true);

    return $before + [BASE_RECOMMENDED_PAGE_URL_META => __('Cím', 'base')] + $after;
});

add_action('manage_' . BASE_RECOMMENDED_PAGE_POST_TYPE . '_posts_custom_column', static function (string $column, int $id): void {
    if ($column !== BASE_RECOMMENDED_PAGE_URL_META) {
        return;
    }

    $url = trim((string) get_post_meta($id, BASE_RECOMMENDED_PAGE_URL_META, true));

    if ($url === '') {
        echo esc_html__('Nincs cím', 'base');

        return;
    }

    printf('<a href="%s" rel="noreferrer">%s</a>', esc_url($url), esc_html($url));
}, 10, 2);
