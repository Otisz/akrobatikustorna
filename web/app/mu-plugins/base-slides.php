<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — Slides
 * Description: The Slide content type behind the home page carousel: an image, a caption and an optional link, in an order the Site Owner controls. Registered in a must-use plugin rather than in the theme, because the club's content must outlive any theme.
 */

if (!defined('ABSPATH')) {
    exit;
}

const BASE_SLIDE_POST_TYPE = 'slide';

/**
 * Where a Slide sends a visitor who clicks it. Optional: most Slides are
 * photography and lead nowhere.
 */
const BASE_SLIDE_LINK_META = 'slide_link';

/**
 * The order Slides appear in: the Site Owner's own numbering first, then the
 * newest, so a Slide added without a number joins the front of the queue.
 */
const BASE_SLIDE_ORDER = ['menu_order' => 'ASC', 'date' => 'DESC'];

add_action('init', static function (): void {
    register_post_type(BASE_SLIDE_POST_TYPE, [
        'labels' => [
            'name' => __('Diák', 'base'),
            'singular_name' => __('Dia', 'base'),
            'add_new' => __('Új dia', 'base'),
            'add_new_item' => __('Új dia hozzáadása', 'base'),
            'edit_item' => __('Dia szerkesztése', 'base'),
            'new_item' => __('Új dia', 'base'),
            'view_item' => __('Dia megtekintése', 'base'),
            'search_items' => __('Diák keresése', 'base'),
            'not_found' => __('Nincs dia', 'base'),
            'not_found_in_trash' => __('A lomtárban nincs dia', 'base'),
            'all_items' => __('Diák', 'base'),
            'menu_name' => __('Diák', 'base'),
            'featured_image' => __('Kép', 'base'),
            'set_featured_image' => __('Kép kiválasztása', 'base'),
            'remove_featured_image' => __('Kép eltávolítása', 'base'),
            'use_featured_image' => __('Legyen ez a dia képe', 'base'),
            'attributes' => __('Sorrend', 'base'),
        ],
        // A Slide is seen only inside the home page carousel, so it has no URL
        // (Uniform Resource Locator), no archive and no place in search results.
        'public' => false,
        'publicly_queryable' => false,
        'exclude_from_search' => true,
        'has_archive' => false,
        'rewrite' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_nav_menus' => false,
        'menu_position' => 21,
        'menu_icon' => 'dashicons-images-alt2',
        // The image is the featured image, the caption is the title, and the
        // order is `page-attributes`' own numeric field. Withholding `editor`
        // also settles which editing screen this is: WordPress opens the block
        // editor only for a post type with a body, and a Slide has none — so the
        // Site Owner gets a short form of exactly the four things a Slide is.
        'supports' => ['title', 'thumbnail', 'page-attributes'],
        // Mapped to the `post` capabilities, so the Editor role the Site Owner
        // holds governs Slides as it governs everything else.
        'capability_type' => 'post',
        'map_meta_cap' => true,
    ]);

    register_post_meta(BASE_SLIDE_POST_TYPE, BASE_SLIDE_LINK_META, [
        'single' => true,
        'type' => 'string',
        'sanitize_callback' => 'sanitize_url',
        'show_in_rest' => false,
    ]);
});

/**
 * The field the Site Owner fills the link in with. Declared in code rather than
 * in the field editor, because the Site Owner cannot reach that screen and a
 * field group kept only in the database would not survive a fresh install.
 */
add_action('acf/init', static function (): void {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group([
        'key' => 'group_base_slide',
        'title' => __('Dia', 'base'),
        'fields' => [
            [
                'key' => 'field_base_slide_link',
                'label' => __('Hivatkozás', 'base'),
                'name' => BASE_SLIDE_LINK_META,
                'type' => 'url',
                'instructions' => __('Nem kötelező. Ide jut a látogató, ha a diára kattint.', 'base'),
            ],
        ],
        'location' => [
            [
                ['param' => 'post_type', 'operator' => '==', 'value' => BASE_SLIDE_POST_TYPE],
            ],
        ],
        'position' => 'side',
        'active' => true,
    ]);
});

/**
 * Lists Slides in the admin in the order they appear in the carousel, so that
 * reordering is a matter of reading the list and changing a number.
 */
add_action('pre_get_posts', static function (WP_Query $query): void {
    if (!is_admin() || !$query->is_main_query() || $query->get('post_type') !== BASE_SLIDE_POST_TYPE) {
        return;
    }

    if ($query->get('orderby') === '') {
        $query->set('orderby', BASE_SLIDE_ORDER);
    }
});
