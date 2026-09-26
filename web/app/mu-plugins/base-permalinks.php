<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — permalinks
 * Description: Declares the public URL (Uniform Resource Locator) structure in code. The Site Owner holds the Editor role and cannot reach the permalink screen, and a structure kept only in the database would not survive a fresh install.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Posts resolve at /hirek/{slug}, the path the outgoing site published news
 * under, so search results and bookmarks survive the rebuild.
 *
 * Filtering the option rather than storing it means the permalink screen no
 * longer decides anything, for an administrator as much as for the Site Owner.
 */
const BASE_PERMALINK_STRUCTURE = '/hirek/%postname%/';

add_filter('pre_option_permalink_structure', static fn (): string => BASE_PERMALINK_STRUCTURE);

/**
 * Everything about one content type that decides the rules WordPress writes for
 * it: where a single one resolves, and where the listing of them does.
 */
function base_post_type_path(WP_Post_Type $type): string
{
    $rewrite = is_array($type->rewrite) ? $type->rewrite : [];
    $single = (string) ($rewrite['slug'] ?? '');
    $front = empty($rewrite['with_front']) ? '' : '^';
    $archive = is_string($type->has_archive) ? $type->has_archive : ($type->has_archive ? $type->name : '');

    return "{$type->name}:{$front}{$single}:{$archive}";
}

/**
 * Everything the cached rewrite rules were built from: the structure above, and
 * the paths of each content type the site adds. Read from the types as they are
 * registered rather than listed here, so that adding a content type is enough on
 * its own — nothing to remember, and nothing to forget.
 */
function base_rewrite_signature(): string
{
    $paths = array_map('base_post_type_path', get_post_types(['_builtin' => false], 'objects'));

    sort($paths);

    return BASE_PERMALINK_STRUCTURE . '|' . implode(',', $paths);
}

/**
 * Rewrite rules are cached in the database and rebuilt only when the permalink
 * screen is saved — which nobody can reach. Rebuilding them whenever the cached
 * rules were built from a different set of paths makes a deploy enough.
 *
 * Runs late in `init`, by which time every content type has registered.
 */
add_action('init', static function (): void {
    $signature = base_rewrite_signature();

    if (get_option('base_rewrite_signature') === $signature) {
        return;
    }

    flush_rewrite_rules();
    update_option('base_rewrite_signature', $signature, false);
}, 99);
