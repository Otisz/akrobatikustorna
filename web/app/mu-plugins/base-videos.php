<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — Videos
 * Description: The Video content type at /galeria: the club's YouTube recordings, each a title and the identifier taken from a pasted link. Registered in a must-use plugin rather than in the theme, because the club's recordings must outlive any theme.
 */

if (!defined('ABSPATH')) {
    exit;
}

const BASE_VIDEO_POST_TYPE = 'video';

/** The path the outgoing site published the club's gallery under. */
const BASE_VIDEO_SLUG = 'galeria';

/**
 * The recording a Video plays, held as YouTube's own identifier for it rather
 * than as the address it was pasted from: YouTube hands the same recording out
 * under several addresses, and the site has to know they are one Video.
 */
const BASE_VIDEO_YOUTUBE_META = 'video_youtube';

/** What one of YouTube's identifiers looks like: eleven of its own characters. */
const BASE_VIDEO_IDENTIFIER_PATTERN = '#^[A-Za-z0-9_-]{11}$#';

/**
 * The order Videos are shown in. Newest first, with nothing for the Site Owner
 * to maintain: a gallery of competition recordings is read from the one that
 * just happened, which is also the order the recordings arrive in.
 *
 * Two Videos published in the same second are a tie WordPress breaks however
 * the database hands them back, so the newer identifier settles it — otherwise
 * a Site Owner pasting one link after another gets an order nobody chose.
 */
const BASE_VIDEO_ORDER = ['date' => 'DESC', 'ID' => 'DESC'];

/**
 * YouTube's identifier for a recording, read out of anything the Site Owner is
 * likely to paste: a watch address, a shortened youtu.be one, an embed, a Short,
 * a live stream, or the identifier on its own — each of them possibly carrying a
 * timestamp, a playlist or a tracking parameter that is not part of the
 * recording.
 *
 * Null where there is no recording in what was pasted, which is what the editing
 * screen refuses on, and what the theme reads a stored identifier back through.
 */
function base_video_identifier(string $pasted): ?string
{
    $pasted = trim($pasted);

    // An identifier is eleven characters of YouTube's own alphabet. On its own
    // it is what an import or WP-CLI (WordPress Command Line Interface) is
    // likely to carry; the editing screen only ever offers a whole address.
    if (preg_match(BASE_VIDEO_IDENTIFIER_PATTERN, $pasted) === 1) {
        return $pasted;
    }

    // The host is read rather than matched inside the address, so that
    // somewhere-else.com/watch?v=… is not taken for YouTube.
    $host = strtolower((string) wp_parse_url($pasted, PHP_URL_HOST));
    $host = (string) preg_replace('#^(?:www|m)\.#', '', $host);

    if (!in_array($host, ['youtube.com', 'youtube-nocookie.com', 'youtu.be'], true)) {
        return null;
    }

    $path = (string) wp_parse_url($pasted, PHP_URL_PATH);
    parse_str((string) wp_parse_url($pasted, PHP_URL_QUERY), $query);

    if ($host === 'youtu.be') {
        // The shortened address YouTube's own Share button hands out.
        $identifier = trim($path, '/');
    } elseif (isset($query['v'])) {
        $identifier = (string) $query['v'];
    } elseif (preg_match('#^/(?:embed|shorts|live|v)/([^/?#]+)#', $path, $found) === 1) {
        $identifier = $found[1];
    } else {
        // A channel, a playlist, or the front page: a YouTube address with no
        // one recording in it.
        return null;
    }

    return preg_match(BASE_VIDEO_IDENTIFIER_PATTERN, $identifier) === 1 ? $identifier : null;
}

/**
 * Where a recording is watched on YouTube itself: what the editing screen shows
 * back, what the admin list links to, and where the gallery sends a visitor
 * whose browser cannot play the recording in place.
 */
function base_video_url(string $identifier): string
{
    return 'https://www.youtube.com/watch?v=' . $identifier;
}

add_action('init', static function (): void {
    register_post_type(BASE_VIDEO_POST_TYPE, [
        'labels' => [
            'name' => __('Videók', 'base'),
            'singular_name' => __('Videó', 'base'),
            'add_new' => __('Új videó', 'base'),
            'add_new_item' => __('Új videó hozzáadása', 'base'),
            'edit_item' => __('Videó szerkesztése', 'base'),
            'new_item' => __('Új videó', 'base'),
            'view_item' => __('Videó megtekintése', 'base'),
            'search_items' => __('Videók keresése', 'base'),
            'not_found' => __('Nincs videó', 'base'),
            'not_found_in_trash' => __('A lomtárban nincs videó', 'base'),
            'all_items' => __('Videók', 'base'),
            'menu_name' => __('Galéria', 'base'),
            'archives' => __('Galéria', 'base'),
        ],
        'public' => true,
        // `with_front` off, because the permalink structure puts every post under
        // /hirek and a Video is not news.
        'rewrite' => ['slug' => BASE_VIDEO_SLUG, 'with_front' => false],
        'has_archive' => BASE_VIDEO_SLUG,
        'show_in_nav_menus' => true,
        'menu_position' => 25,
        'menu_icon' => 'dashicons-video-alt3',
        // A Video is its title and a link, and nothing else: no body to write,
        // no picture to choose — YouTube already holds the recording's own
        // thumbnail — and no number to order it by. Withholding `editor` also
        // settles which editing screen this is, as it does for a Document.
        'supports' => ['title'],
        // Mapped to the `post` capabilities, so the Editor role the Site Owner
        // holds governs Videos as it governs everything else.
        'capability_type' => 'post',
        'map_meta_cap' => true,
    ]);

    register_post_meta(BASE_VIDEO_POST_TYPE, BASE_VIDEO_YOUTUBE_META, [
        'single' => true,
        'type' => 'string',
        // The pasted address is reduced to the identifier here rather than in the
        // field, so that a Video written past the editing screen — imported, or
        // made by WP-CLI (WordPress Command Line Interface) — holds the same
        // thing a Video the Site Owner saved does.
        'sanitize_callback' => static fn ($value): string => (string) base_video_identifier((string) $value),
        'show_in_rest' => false,
    ]);
});

/**
 * The field the Site Owner pastes the link into. Declared in code rather than in
 * the field editor, because the Site Owner cannot reach that screen and a field
 * group kept only in the database would not survive a fresh install.
 *
 * In the main column rather than the sidebar, because the recording *is* the
 * Video. Required for the same reason a Document's file is: a Video that plays
 * nothing is not a Video.
 */
add_action('acf/init', static function (): void {
    if (!function_exists('acf_add_local_field_group')) {
        return;
    }

    acf_add_local_field_group([
        'key' => 'group_base_video',
        'title' => __('Videó', 'base'),
        'fields' => [
            [
                'key' => 'field_base_video_youtube',
                'label' => __('YouTube-hivatkozás', 'base'),
                'name' => BASE_VIDEO_YOUTUBE_META,
                'type' => 'url',
                'required' => 1,
                'instructions' => __('Másold ide a videó YouTube-címét. A Megosztás gombbal kapott cím is jó.', 'base'),
            ],
        ],
        'location' => [
            [
                ['param' => 'post_type', 'operator' => '==', 'value' => BASE_VIDEO_POST_TYPE],
            ],
        ],
        'position' => 'normal',
        'active' => true,
    ]);
});

/**
 * Refuses an address with no recording in it, at the screen, in the Site Owner's
 * own words — a mistyped link would otherwise be saved as a Video that plays
 * nothing, and the gallery is the wrong place to discover that.
 */
add_filter('acf/validate_value/key=field_base_video_youtube', static function ($valid, $value) {
    if ($valid !== true || (string) $value === '') {
        return $valid;
    }

    return base_video_identifier((string) $value) === null
        ? __('Ez nem YouTube-videó címe. Nyisd meg a videót a YouTube-on, és másold ide a böngésző címsorában látható címet.', 'base')
        : true;
}, 10, 2);

/**
 * Shows the identifier back as the address it names, so that what the screen
 * holds is a link the Site Owner can follow and recognise — and so they can see
 * which recording the site took from what they pasted, timestamp and tracking
 * parameter discarded.
 *
 * This is the one place the two disagree: the fields plugin hands out the
 * address, while the meta row holds the identifier. Anything reading a Video
 * reads the meta, through `Base\video_identifier()`.
 */
add_filter('acf/load_value/key=field_base_video_youtube', static function ($value) {
    $id = base_video_identifier((string) $value);

    return $id === null ? $value : base_video_url($id);
});

/**
 * Names the gallery in the heading and in the browser's own title, where
 * WordPress would otherwise print the plural of the post type: a visitor arrives
 * at the club's gallery, not at a list of Videos, and the two are different
 * words here — which is the whole reason the type carries an `archives` label of
 * its own.
 */
add_filter('post_type_archive_title', static function (string $title, string $type): string {
    return $type === BASE_VIDEO_POST_TYPE
        ? get_post_type_object(BASE_VIDEO_POST_TYPE)->labels->archives
        : $title;
}, 10, 2);

/**
 * Lists Videos in the admin in the order the gallery shows them, so that the
 * list reads as the gallery does.
 */
add_action('pre_get_posts', static function (WP_Query $query): void {
    if (!is_admin() || !$query->is_main_query() || $query->get('post_type') !== BASE_VIDEO_POST_TYPE) {
        return;
    }

    if ($query->get('orderby') === '') {
        $query->set('orderby', BASE_VIDEO_ORDER);
    }
});

/**
 * Holds the gallery to that same order, whole: a club publishes few enough
 * recordings a season that paginating them would only hide one.
 *
 * A Video with no recording is left off, because a player with nothing to play
 * is worse than no player. The field is required, so the only Videos this drops
 * are ones written past the editing screen.
 */
add_action('pre_get_posts', static function (WP_Query $query): void {
    if (is_admin() || !$query->is_main_query() || !$query->is_post_type_archive(BASE_VIDEO_POST_TYPE)) {
        return;
    }

    $query->set('orderby', BASE_VIDEO_ORDER);
    $query->set('posts_per_page', -1);
    $query->set('meta_query', [
        // Spelled out as a comparison rather than `EXISTS`, because an address
        // with no recording in it leaves the meta row behind with nothing in it.
        ['key' => BASE_VIDEO_YOUTUBE_META, 'value' => '', 'compare' => '!='],
    ]);
});

/**
 * A Video is watched in the gallery, which is the one public address the content
 * model gives it, so a Video's own URL (Uniform Resource Locator) carries a
 * visitor there — to its place on that page — rather than standing up a page
 * that holds nothing the gallery does not already offer.
 *
 * A preview is not exempted, as a Department's is, and for the reason a
 * Document's is not: the editing screen already shows the link back, and the
 * Site Owner can follow it.
 */
add_action('template_redirect', static function (): void {
    if (!is_singular(BASE_VIDEO_POST_TYPE)) {
        return;
    }

    $listing = get_post_type_archive_link(BASE_VIDEO_POST_TYPE);

    if (!is_string($listing)) {
        return;
    }

    wp_safe_redirect($listing . '#' . get_post_field('post_name'), 301);
    exit;
});

/**
 * Prints each Video's recording in the admin list, beside its title: a Video
 * missing one is only visible here, and the identifier is what the club's own
 * YouTube channel names the recording by.
 */
add_filter('manage_' . BASE_VIDEO_POST_TYPE . '_posts_columns', static function (array $columns): array {
    $before = array_slice($columns, 0, 2, true);
    $after = array_slice($columns, 2, null, true);

    return $before + [BASE_VIDEO_YOUTUBE_META => __('Videó', 'base')] + $after;
});

add_action('manage_' . BASE_VIDEO_POST_TYPE . '_posts_custom_column', static function (string $column, int $id): void {
    if ($column !== BASE_VIDEO_YOUTUBE_META) {
        return;
    }

    $video = base_video_identifier((string) get_post_meta($id, BASE_VIDEO_YOUTUBE_META, true));

    if ($video === null) {
        echo esc_html__('Nincs videó', 'base');

        return;
    }

    printf(
        '<a href="%s" rel="noreferrer">%s</a>',
        esc_url(base_video_url($video)),
        esc_html($video)
    );
}, 10, 2);
