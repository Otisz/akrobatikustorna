<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — Documents
 * Description: The Document content type at /dokumentumok: the club's downloadable forms and regulations, each a title and a file in the media library. Registered in a must-use plugin rather than in the theme, because the club's forms must outlive any theme.
 */

if (!defined('ABSPATH')) {
    exit;
}

const BASE_DOCUMENT_POST_TYPE = 'document';

/** The path the outgoing site published the club's Documents under. */
const BASE_DOCUMENT_SLUG = 'dokumentumok';

/** The file a Document offers, held as its media library identifier. */
const BASE_DOCUMENT_FILE_META = 'document_file';

/**
 * The order Documents are listed in. Alphabetical, as the outgoing site listed
 * them: a parent arrives looking for a form by name, and it is the one order
 * that asks the Site Owner to maintain nothing — an upload lands where its name
 * puts it, which is why publishing is the last step.
 */
const BASE_DOCUMENT_ORDER = ['title' => 'ASC'];

add_action('init', static function (): void {
    register_post_type(BASE_DOCUMENT_POST_TYPE, [
        'labels' => [
            'name' => __('Dokumentumok', 'base'),
            'singular_name' => __('Dokumentum', 'base'),
            'add_new' => __('Új dokumentum', 'base'),
            'add_new_item' => __('Új dokumentum feltöltése', 'base'),
            'edit_item' => __('Dokumentum szerkesztése', 'base'),
            'new_item' => __('Új dokumentum', 'base'),
            'view_item' => __('Dokumentum megtekintése', 'base'),
            'search_items' => __('Dokumentumok keresése', 'base'),
            'not_found' => __('Nincs dokumentum', 'base'),
            'not_found_in_trash' => __('A lomtárban nincs dokumentum', 'base'),
            'all_items' => __('Dokumentumok', 'base'),
            'menu_name' => __('Dokumentumok', 'base'),
            'archives' => __('Dokumentumok', 'base'),
        ],
        'public' => true,
        // `with_front` off, because the permalink structure puts every post under
        // /hirek and a Document is not news.
        'rewrite' => ['slug' => BASE_DOCUMENT_SLUG, 'with_front' => false],
        'has_archive' => BASE_DOCUMENT_SLUG,
        'show_in_nav_menus' => true,
        'menu_position' => 24,
        'menu_icon' => 'dashicons-media-default',
        // A Document is its title and its file, and nothing else: no body to
        // write, no picture, no number to order it by. Withholding `editor` also
        // settles which editing screen this is — WordPress opens the block editor
        // only for a post type with a body — so the Site Owner gets a short form
        // of the two things a Document is.
        'supports' => ['title'],
        // Mapped to the `post` capabilities, so the Editor role the Site Owner
        // holds governs Documents as it governs everything else.
        'capability_type' => 'post',
        'map_meta_cap' => true,
    ]);

    register_post_meta(BASE_DOCUMENT_POST_TYPE, BASE_DOCUMENT_FILE_META, [
        'single' => true,
        'type' => 'integer',
        'sanitize_callback' => 'absint',
        'show_in_rest' => false,
    ]);
});

/**
 * The field the Site Owner chooses the file in. Declared in code rather than in
 * the field editor, because the Site Owner cannot reach that screen and a field
 * group kept only in the database would not survive a fresh install.
 *
 * In the main column rather than the sidebar, because unlike a Trainer's role or
 * a Slide's link this is not something beside the content — the file *is* the
 * Document. Required for the same reason: a Document with nothing to download is
 * not a Document, and refusing it at the editing screen is the one place the Site
 * Owner can still see what went wrong.
 *
 * Replacing the file is choosing another one here, which is why nothing in the
 * club's own copy of a form has to be preserved: the newer version is a new
 * upload, and the listing follows the field.
 */
add_action('acf/init', static function (): void {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group([
        'key' => 'group_base_document',
        'title' => __('Dokumentum', 'base'),
        'fields' => [
            [
                'key' => 'field_base_document_file',
                'label' => __('Fájl', 'base'),
                'name' => BASE_DOCUMENT_FILE_META,
                'type' => 'file',
                'required' => 1,
                'return_format' => 'id',
                'instructions' => __('Ezt töltik le a látogatók. Újabb változat esetén cseréld ki itt a fájlt.', 'base'),
            ],
        ],
        'location' => [
            [
                ['param' => 'post_type', 'operator' => '==', 'value' => BASE_DOCUMENT_POST_TYPE],
            ],
        ],
        'position' => 'normal',
        'active' => true,
    ]);
});

/**
 * A Document is downloaded from the listing, which is the one public address the
 * content model gives it, so a Document's own URL (Uniform Resource Locator)
 * carries a visitor there — to its place on that page — rather than standing up a
 * page that holds nothing the listing does not already offer.
 *
 * Deliberately not a redirect to the file itself, which would give the same
 * download two addresses on a rebuild whose point is to keep the club's search
 * rankings.
 *
 * A preview is not exempted, as a Department's is, and this is the reason: a
 * Department draft is prose the Site Owner can read nowhere else, whereas a
 * Document draft is a file the editing screen already names, sizes and links to.
 * There is nothing a preview could show that the screen does not.
 */
add_action('template_redirect', static function (): void {
    if (!is_singular(BASE_DOCUMENT_POST_TYPE)) {
        return;
    }

    $listing = get_post_type_archive_link(BASE_DOCUMENT_POST_TYPE);

    if (!is_string($listing)) {
        return;
    }

    wp_safe_redirect($listing . '#' . get_post_field('post_name'), 301);
    exit;
});

/**
 * Lists Documents in the admin in the order a parent reads them in, so that the
 * list reads as the listing does.
 */
add_action('pre_get_posts', static function (WP_Query $query): void {
    if (!is_admin() || !$query->is_main_query() || $query->get('post_type') !== BASE_DOCUMENT_POST_TYPE) {
        return;
    }

    if ($query->get('orderby') === '') {
        $query->set('orderby', BASE_DOCUMENT_ORDER);
    }
});

/**
 * Holds the public listing to that same order, whole: a club has few enough
 * forms that paginating them would only hide the one a parent came for.
 *
 * A Document with no file at all is left off, because a row that downloads
 * nothing is worse than no row. The field is required, so the only Documents
 * this drops are ones written past the editing screen — imported, or made by
 * WP-CLI (WordPress Command Line Interface). A file deleted from the media
 * library *after* it was chosen leaves its identifier behind and passes here;
 * that one is caught where the row is rendered, in `template-parts/document.php`.
 * Either way the admin list prints each Document's file, so the omission is
 * visible to the Site Owner rather than silent.
 */
add_action('pre_get_posts', static function (WP_Query $query): void {
    if (is_admin() || !$query->is_main_query() || !$query->is_post_type_archive(BASE_DOCUMENT_POST_TYPE)) {
        return;
    }

    $query->set('orderby', BASE_DOCUMENT_ORDER);
    $query->set('posts_per_page', -1);
    $query->set('meta_query', [
        // Spelled out as a comparison rather than `EXISTS`, because a Document
        // whose file was taken away keeps the meta row with an empty value in it.
        ['key' => BASE_DOCUMENT_FILE_META, 'value' => '', 'compare' => '!='],
    ]);
});

/**
 * Prints each Document's file name in the admin list, beside its title: the title
 * is the club's word for the form and the file name is the developer's, and a
 * Document missing its file is only visible here.
 */
add_filter('manage_' . BASE_DOCUMENT_POST_TYPE . '_posts_columns', static function (array $columns): array {
    $before = array_slice($columns, 0, 2, true);
    $after = array_slice($columns, 2, null, true);

    return $before + [BASE_DOCUMENT_FILE_META => __('Fájl', 'base')] + $after;
});

add_action('manage_' . BASE_DOCUMENT_POST_TYPE . '_posts_custom_column', static function (string $column, int $id): void {
    if ($column !== BASE_DOCUMENT_FILE_META) {
        return;
    }

    $file = (int) get_post_meta($id, BASE_DOCUMENT_FILE_META, true);
    $path = $file > 0 ? get_attached_file($file) : false;

    echo esc_html(is_string($path) ? wp_basename($path) : __('Nincs fájl', 'base'));
}, 10, 2);
