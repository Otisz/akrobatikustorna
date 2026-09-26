<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — Departments
 * Description: The Department content type at /szakosztalyok: the club's Departments, each with a picture and a description of its own, in an order the Site Owner controls. Registered in a must-use plugin rather than in the theme, because the club's Departments must outlive any theme.
 */

if (!defined('ABSPATH')) {
    exit;
}

const BASE_DEPARTMENT_POST_TYPE = 'department';

/** The path the outgoing site published the club's Departments under. */
const BASE_DEPARTMENT_SLUG = 'szakosztalyok';

/**
 * The order Departments are read in: the Site Owner's own numbering first, which
 * is how the club says which one comes first, then alphabetically, so that a
 * Department left unnumbered lands somewhere a parent can scan rather than
 * wherever it happened to be written.
 */
const BASE_DEPARTMENT_ORDER = ['menu_order' => 'ASC', 'title' => 'ASC'];

/** Whether the initial Departments below have been installed. */
const BASE_DEPARTMENT_SEEDED_OPTION = 'base_departments_seeded';

add_action('init', static function (): void {
    register_post_type(BASE_DEPARTMENT_POST_TYPE, [
        'labels' => [
            'name' => __('Szakosztályok', 'base'),
            'singular_name' => __('Szakosztály', 'base'),
            'add_new' => __('Új szakosztály', 'base'),
            'add_new_item' => __('Új szakosztály hozzáadása', 'base'),
            'edit_item' => __('Szakosztály szerkesztése', 'base'),
            'new_item' => __('Új szakosztály', 'base'),
            'view_item' => __('Szakosztály megtekintése', 'base'),
            'search_items' => __('Szakosztályok keresése', 'base'),
            'not_found' => __('Nincs szakosztály', 'base'),
            'not_found_in_trash' => __('A lomtárban nincs szakosztály', 'base'),
            'all_items' => __('Szakosztályok', 'base'),
            'menu_name' => __('Szakosztályok', 'base'),
            'featured_image' => __('Kép', 'base'),
            'set_featured_image' => __('Kép kiválasztása', 'base'),
            'remove_featured_image' => __('Kép eltávolítása', 'base'),
            'use_featured_image' => __('Legyen ez a szakosztály képe', 'base'),
            'attributes' => __('Sorrend', 'base'),
            'archives' => __('Szakosztályok', 'base'),
        ],
        'public' => true,
        // `with_front` off, because the permalink structure puts every post under
        // /hirek and a Department is not news.
        'rewrite' => ['slug' => BASE_DEPARTMENT_SLUG, 'with_front' => false],
        'has_archive' => BASE_DEPARTMENT_SLUG,
        'show_in_nav_menus' => true,
        'menu_position' => 23,
        'menu_icon' => 'dashicons-awards',
        // A Department is three things the block editor already has: the name is
        // the title, the description is the body, and the picture is the featured
        // image. `page-attributes` adds the number that orders them. Nothing here
        // needs a field group, so the Site Owner is given none to fill in.
        'supports' => ['title', 'editor', 'thumbnail', 'page-attributes'],
        // Mapped to the `post` capabilities, so the Editor role the Site Owner
        // holds governs Departments as it governs everything else.
        'capability_type' => 'post',
        'map_meta_cap' => true,
        // The block editor reads and writes the post through the REST
        // (Representational State Transfer) route, so the type needs one.
        'show_in_rest' => true,
    ]);
});

/**
 * The club's Departments as it runs them today. The outgoing site held no
 * Department descriptions at all — its `/szakosztalyok` page was a hardcoded
 * competition calendar — so this text is written fresh rather than transferred.
 *
 * Initial content only: it is installed once and never written again, because
 * from that moment the words belong to the Site Owner rather than to this file.
 * Pictures are deliberately not part of it; there is no club photograph in code
 * to attach, and choosing one is the first thing the Site Owner does here.
 */
function base_department_initial_content(): array
{
    return [
        [
            'title' => 'Akrobatikus torna',
            'slug' => 'akrobatikus-torna',
            'paragraphs' => [
                'Az egyesület legnagyobb szakosztálya. Párokban és csoportokban végzett akrobatikus gyakorlatok, ahol az egyik sportoló emel és tart, a másik pedig a levegőben dolgozik — ehhez erő, egyensúly és bizalom kell, és mindhárom tanulható.',
                'Versenyezni nem kötelező. A szabadidős csoportokba a mozgás öröméért járnak a gyerekek, a „B” kategória a versenyzés első lépése, az „A” kategóriában pedig hazai pontszerző versenyekre, Európa- és világbajnokságra készülnek a sportolóink.',
                'A gyerekek egy próbaedzésen való felmérés után kerülnek a nekik megfelelő csoportba, a vezetőedző javaslata alapján, a szülővel egyeztetve.',
            ],
        ],
        [
            'title' => 'Akrobatikus tánc',
            'slug' => 'akrobatikus-tanc',
            'paragraphs' => [
                'Tánc és akrobatika egy gyakorlatban: koreográfiára épülő, zenére előadott programok, amelyekben a tornából hozott elemeket tánctudás fogja össze.',
                'A szakosztály versenyzői a Magyar Látványtánc Sportszövetség versenynaptára szerint indulnak.',
            ],
        ],
    ];
}

/** A Department's description in the markup the paragraph block saves. */
function base_department_content(array $paragraphs): string
{
    return implode("\n\n", array_map(
        static fn (string $text): string => "<!-- wp:paragraph -->\n<p>" . esc_html($text) . "</p>\n<!-- /wp:paragraph -->",
        $paragraphs
    ));
}

/**
 * Publishes the initial Departments once, on the first request after a deploy
 * that has never had them, so that every environment — staging included — comes
 * up with the club's Departments rather than an empty page.
 *
 * Deliberately not repeated, and skipped entirely where a Department already
 * exists in any state, the trash included: a Site Owner who deleted or rewrote a
 * Department has decided something, and content that grew back would be a
 * haunting rather than a feature.
 *
 * The flag is written only once every Department is actually in the database, so
 * that a request which dies halfway leaves the site to try again on the next one
 * rather than permanently empty.
 */
add_action('init', static function (): void {
    if (get_option(BASE_DEPARTMENT_SEEDED_OPTION) !== false) {
        return;
    }

    $existing = get_posts([
        'post_type' => BASE_DEPARTMENT_POST_TYPE,
        // Spelled out rather than `any`, which omits the trash: a trashed
        // Department is still one the Site Owner has seen and thrown away.
        'post_status' => ['publish', 'future', 'draft', 'pending', 'private', 'trash'],
        'posts_per_page' => 1,
        'fields' => 'ids',
    ]);

    if ($existing === []) {
        foreach (base_department_initial_content() as $position => $department) {
            $id = wp_insert_post([
                'post_type' => BASE_DEPARTMENT_POST_TYPE,
                'post_status' => 'publish',
                'post_title' => $department['title'],
                'post_name' => $department['slug'],
                'post_content' => base_department_content($department['paragraphs']),
                'menu_order' => $position + 1,
            ], true);

            if (is_wp_error($id)) {
                return;
            }
        }
    }

    update_option(BASE_DEPARTMENT_SEEDED_OPTION, true, false);
}, 20);

/**
 * A Department is read on the listing, which is the one public address the
 * content model gives it, so a Department's own URL (Uniform Resource Locator)
 * carries a visitor there — to its place on that page — rather than standing up
 * a second, thinner copy of the same words for a search engine to choose between.
 *
 * A preview is exempt: a draft is not something a search engine reaches, and the
 * Site Owner checking one before publishing has nowhere else to see it.
 */
add_action('template_redirect', static function (): void {
    if (!is_singular(BASE_DEPARTMENT_POST_TYPE) || is_preview()) {
        return;
    }

    $listing = get_post_type_archive_link(BASE_DEPARTMENT_POST_TYPE);

    if (!is_string($listing)) {
        return;
    }

    wp_safe_redirect($listing . '#' . get_post_field('post_name'), 301);
    exit;
});

/**
 * Lists Departments in the admin in the order a parent reads them in, so that
 * reordering is a matter of reading the list and changing a number.
 */
add_action('pre_get_posts', static function (WP_Query $query): void {
    if (!is_admin() || !$query->is_main_query() || $query->get('post_type') !== BASE_DEPARTMENT_POST_TYPE) {
        return;
    }

    if ($query->get('orderby') === '') {
        $query->set('orderby', BASE_DEPARTMENT_ORDER);
    }
});

/**
 * Holds the public listing to that same order, whole: the club has a handful of
 * Departments, and paginating them would only break the order the Site Owner put
 * them in and hide one a parent came to compare.
 */
add_action('pre_get_posts', static function (WP_Query $query): void {
    if (is_admin() || !$query->is_main_query() || !$query->is_post_type_archive(BASE_DEPARTMENT_POST_TYPE)) {
        return;
    }

    $query->set('orderby', BASE_DEPARTMENT_ORDER);
    $query->set('posts_per_page', -1);
});

/**
 * Prints each Department's number in the admin list, so that the list reads as
 * the public listing does and reordering is a matter of changing a number. The
 * number itself is changed through Quick Edit: WordPress's block editor sidebar
 * no longer offers the order field, and the list is in any case where the Site
 * Owner can see one Department's position against the others.
 */
add_filter('manage_' . BASE_DEPARTMENT_POST_TYPE . '_posts_columns', static function (array $columns): array {
    $before = array_slice($columns, 0, 2, true);
    $after = array_slice($columns, 2, null, true);

    return $before + ['menu_order' => __('Sorrend', 'base')] + $after;
});

add_action('manage_' . BASE_DEPARTMENT_POST_TYPE . '_posts_custom_column', static function (string $column, int $id): void {
    if ($column === 'menu_order') {
        echo esc_html((string) get_post_field('menu_order', $id));
    }
}, 10, 2);
