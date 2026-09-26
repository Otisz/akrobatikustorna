<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — Trainers
 * Description: The Trainer content type at /edzok: a portrait, a role and a biography, in an order the Site Owner controls. Registered in a must-use plugin rather than in the theme, because the club's staff must outlive any theme.
 */

if (!defined('ABSPATH')) {
    exit;
}

const BASE_TRAINER_POST_TYPE = 'trainer';

/** The path the outgoing site published its coaches under. */
const BASE_TRAINER_SLUG = 'edzok';

/** What the Trainer does at the club, read under their name. */
const BASE_TRAINER_ROLE_META = 'trainer_role';

/**
 * The order Trainers are listed in: the Site Owner's own numbering first, which
 * is how the club's sense of seniority is expressed, then alphabetically, so
 * that Trainers left unnumbered are in an order a parent can scan rather than
 * the order they happened to be entered in.
 */
const BASE_TRAINER_ORDER = ['menu_order' => 'ASC', 'title' => 'ASC'];

add_action('init', static function (): void {
    register_post_type(BASE_TRAINER_POST_TYPE, [
        'labels' => [
            'name' => __('Edzők', 'base'),
            'singular_name' => __('Edző', 'base'),
            'add_new' => __('Új edző', 'base'),
            'add_new_item' => __('Új edző hozzáadása', 'base'),
            'edit_item' => __('Edző szerkesztése', 'base'),
            'new_item' => __('Új edző', 'base'),
            'view_item' => __('Edző megtekintése', 'base'),
            'search_items' => __('Edzők keresése', 'base'),
            'not_found' => __('Nincs edző', 'base'),
            'not_found_in_trash' => __('A lomtárban nincs edző', 'base'),
            'all_items' => __('Edzők', 'base'),
            'menu_name' => __('Edzők', 'base'),
            'featured_image' => __('Portré', 'base'),
            'set_featured_image' => __('Portré kiválasztása', 'base'),
            'remove_featured_image' => __('Portré eltávolítása', 'base'),
            'use_featured_image' => __('Legyen ez az edző portréja', 'base'),
            'attributes' => __('Sorrend', 'base'),
            'archives' => __('Edzőink', 'base'),
        ],
        'public' => true,
        // `with_front` off, because the permalink structure puts every post under
        // /hirek and a Trainer is not news.
        'rewrite' => ['slug' => BASE_TRAINER_SLUG, 'with_front' => false],
        'has_archive' => BASE_TRAINER_SLUG,
        'show_in_nav_menus' => true,
        'menu_position' => 22,
        'menu_icon' => 'dashicons-groups',
        // The portrait is the featured image, the name is the title, the
        // biography is the body, and the order is `page-attributes`' own numeric
        // field. A Trainer has a body, so this is the block editor — the same
        // screen the Site Owner writes a Post in.
        'supports' => ['title', 'editor', 'thumbnail', 'page-attributes'],
        // Mapped to the `post` capabilities, so the Editor role the Site Owner
        // holds governs Trainers as it governs everything else.
        'capability_type' => 'post',
        'map_meta_cap' => true,
        // The block editor reads and writes the post through the REST
        // (Representational State Transfer) route, so the type needs one.
        'show_in_rest' => true,
    ]);

    register_post_meta(BASE_TRAINER_POST_TYPE, BASE_TRAINER_ROLE_META, [
        'single' => true,
        'type' => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'show_in_rest' => false,
    ]);
});

/**
 * The field the Site Owner fills the role in with. Declared in code rather than
 * in the field editor, because the Site Owner cannot reach that screen and a
 * field group kept only in the database would not survive a fresh install.
 *
 * There is deliberately no colour field beside it. The outgoing site offered a
 * free hex colour per Trainer, which is how its listing came to hold seven
 * unrelated colours; a per-Trainer accent, if the design ever wants one, is a
 * selection from a fixed palette, never a picker.
 */
add_action('acf/init', static function (): void {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group([
        'key' => 'group_base_trainer',
        'title' => __('Edző', 'base'),
        'fields' => [
            [
                'key' => 'field_base_trainer_role',
                'label' => __('Beosztás', 'base'),
                'name' => BASE_TRAINER_ROLE_META,
                'type' => 'text',
                'instructions' => __('Például: vezetőedző. Az edző neve alatt jelenik meg.', 'base'),
            ],
        ],
        'location' => [
            [
                ['param' => 'post_type', 'operator' => '==', 'value' => BASE_TRAINER_POST_TYPE],
            ],
        ],
        'position' => 'side',
        'active' => true,
    ]);
});

/**
 * Lists Trainers in the admin in the order a parent reads them in, so that
 * reordering is a matter of reading the list and changing a number.
 */
add_action('pre_get_posts', static function (WP_Query $query): void {
    if (!is_admin() || !$query->is_main_query() || $query->get('post_type') !== BASE_TRAINER_POST_TYPE) {
        return;
    }

    if ($query->get('orderby') === '') {
        $query->set('orderby', BASE_TRAINER_ORDER);
    }
});

/**
 * Holds the public listing to that same order, whole: a club has few enough
 * coaches that paginating would only break the order the Site Owner put them in.
 */
add_action('pre_get_posts', static function (WP_Query $query): void {
    if (is_admin() || !$query->is_main_query() || !$query->is_post_type_archive(BASE_TRAINER_POST_TYPE)) {
        return;
    }

    $query->set('orderby', BASE_TRAINER_ORDER);
    $query->set('posts_per_page', -1);
});

/**
 * Prints each Trainer's number in the admin list, so that the list reads as the
 * public listing does and reordering is a matter of changing a number. The
 * number itself is changed through Quick Edit: WordPress's block editor sidebar
 * no longer offers the order field, and the list is in any case where the Site
 * Owner can see one Trainer's position against the others.
 */
add_filter('manage_' . BASE_TRAINER_POST_TYPE . '_posts_columns', static function (array $columns): array {
    $before = array_slice($columns, 0, 2, true);
    $after = array_slice($columns, 2, null, true);

    return $before + ['menu_order' => __('Sorrend', 'base')] + $after;
});

add_action('manage_' . BASE_TRAINER_POST_TYPE . '_posts_custom_column', static function (string $column, int $id): void {
    if ($column === 'menu_order') {
        echo esc_html((string) get_post_field('menu_order', $id));
    }
}, 10, 2);
