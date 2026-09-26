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
 * Rewrite rules are cached in the database and rebuilt only when the permalink
 * screen is saved — which nobody can reach. Rebuilding them whenever the cached
 * rules were built from a different structure makes a deploy enough.
 */
add_action('init', static function (): void {
    if (get_option('base_rewrite_signature') === BASE_PERMALINK_STRUCTURE) {
        return;
    }

    flush_rewrite_rules();
    update_option('base_rewrite_signature', BASE_PERMALINK_STRUCTURE, false);
}, 99);
