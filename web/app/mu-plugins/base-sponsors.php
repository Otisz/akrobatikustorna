<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — Sponsors
 * Description: The Sponsor content type: an organisation supporting the club, credited on the home page as a logo linking to their own site. Registered in a must-use plugin rather than in the theme, because the club's supporters must outlive any theme.
 */

if (!defined('ABSPATH')) {
    exit;
}

const BASE_SPONSOR_POST_TYPE = 'sponsor';

/**
 * The Sponsor's own site, which is what their logo leads to. Required: a logo
 * that credits nobody reachable is a picture, not a credit.
 */
const BASE_SPONSOR_URL_META = 'sponsor_url';

/**
 * The order Sponsors are credited in. Alphabetical, because the club credits its
 * Sponsors as equals — ranking them is a conversation nobody wants to have with
 * a sponsor, and this is the one order that asks the Site Owner to maintain
 * nothing.
 */
const BASE_SPONSOR_ORDER = ['title' => 'ASC'];

add_action('init', static function (): void {
    register_post_type(BASE_SPONSOR_POST_TYPE, [
        'labels' => [
            'name' => __('Támogatók', 'base'),
            'singular_name' => __('Támogató', 'base'),
            'add_new' => __('Új támogató', 'base'),
            'add_new_item' => __('Új támogató hozzáadása', 'base'),
            'edit_item' => __('Támogató szerkesztése', 'base'),
            'new_item' => __('Új támogató', 'base'),
            'view_item' => __('Támogató megtekintése', 'base'),
            'search_items' => __('Támogatók keresése', 'base'),
            'not_found' => __('Nincs támogató', 'base'),
            'not_found_in_trash' => __('A lomtárban nincs támogató', 'base'),
            'all_items' => __('Támogatók', 'base'),
            'menu_name' => __('Támogatók', 'base'),
            'featured_image' => __('Logó', 'base'),
            'set_featured_image' => __('Logó kiválasztása', 'base'),
            'remove_featured_image' => __('Logó eltávolítása', 'base'),
            'use_featured_image' => __('Legyen ez a támogató logója', 'base'),
        ],
        // A Sponsor is seen only among the credits on the home page, so it has no
        // URL (Uniform Resource Locator) of its own, no archive and no place in
        // search results — the address a visitor wants is the sponsor's, not one
        // this site could give them.
        'public' => false,
        'publicly_queryable' => false,
        'exclude_from_search' => true,
        'has_archive' => false,
        'rewrite' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_nav_menus' => false,
        'menu_position' => 26,
        'menu_icon' => 'dashicons-heart',
        // The name is the title and the logo is the featured image; the address is
        // the one thing left for a field group. Withholding `editor` also settles
        // which editing screen this is — WordPress opens the block editor only for
        // a post type with a body — so the Site Owner gets a short form of the
        // three things a Sponsor is.
        'supports' => ['title', 'thumbnail'],
        // Mapped to the `post` capabilities, so the Editor role the Site Owner
        // holds governs Sponsors as it governs everything else.
        'capability_type' => 'post',
        'map_meta_cap' => true,
    ]);

    register_post_meta(BASE_SPONSOR_POST_TYPE, BASE_SPONSOR_URL_META, [
        'single' => true,
        'type' => 'string',
        'sanitize_callback' => 'sanitize_url',
        'show_in_rest' => false,
    ]);
});

/**
 * The field the Site Owner fills the Sponsor's address in. Declared in code
 * rather than in the field editor, because the Site Owner cannot reach that screen
 * and a field group kept only in the database would not survive a fresh install.
 *
 * In the main column rather than the sidebar, and required: unlike a Slide's link,
 * this is not something beside the content. A credit that leads nowhere fails the
 * only thing the sponsor was promised, and the editing screen is the one place the
 * Site Owner can still see that.
 */
add_action('acf/init', static function (): void {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group([
        'key' => 'group_base_sponsor',
        'title' => __('Támogató', 'base'),
        'fields' => [
            [
                'key' => 'field_base_sponsor_url',
                'label' => __('Weboldal', 'base'),
                'name' => BASE_SPONSOR_URL_META,
                'type' => 'url',
                'required' => 1,
                'instructions' => __('Ide jut a látogató, ha a támogató logójára kattint.', 'base'),
            ],
        ],
        'location' => [
            [
                ['param' => 'post_type', 'operator' => '==', 'value' => BASE_SPONSOR_POST_TYPE],
            ],
        ],
        'position' => 'normal',
        'active' => true,
    ]);
});

/**
 * Lists Sponsors in the admin in the order the home page credits them, so that
 * the list reads as the credits do.
 */
add_action('pre_get_posts', static function (WP_Query $query): void {
    if (!is_admin() || !$query->is_main_query() || $query->get('post_type') !== BASE_SPONSOR_POST_TYPE) {
        return;
    }

    if ($query->get('orderby') === '') {
        $query->set('orderby', BASE_SPONSOR_ORDER);
    }
});

/**
 * Prints each Sponsor's logo and address in the admin list, beside its name —
 * the two things a credit is made of, and neither of them otherwise visible in a
 * list of titles.
 *
 * The logo column is what makes a Sponsor saved before its logo arrived visible
 * to the Site Owner: a featured image cannot be required the way the address is,
 * so the credits leave that Sponsor out, and this is where they can see why.
 */
add_filter('manage_' . BASE_SPONSOR_POST_TYPE . '_posts_columns', static function (array $columns): array {
    $before = array_slice($columns, 0, 2, true);
    $after = array_slice($columns, 2, null, true);

    return $before + [
        'sponsor_logo' => __('Logó', 'base'),
        BASE_SPONSOR_URL_META => __('Weboldal', 'base'),
    ] + $after;
});

add_action('manage_' . BASE_SPONSOR_POST_TYPE . '_posts_custom_column', static function (string $column, int $id): void {
    if ($column === 'sponsor_logo') {
        $logo = get_the_post_thumbnail($id, [60, 60], ['style' => 'height:auto;width:auto;max-height:60px']);

        echo $logo === '' ? esc_html__('Nincs logó', 'base') : $logo;

        return;
    }

    if ($column !== BASE_SPONSOR_URL_META) {
        return;
    }

    $url = trim((string) get_post_meta($id, BASE_SPONSOR_URL_META, true));

    if ($url === '') {
        echo esc_html__('Nincs weboldal', 'base');

        return;
    }

    printf('<a href="%s" rel="noreferrer">%s</a>', esc_url($url), esc_html($url));
}, 10, 2);
