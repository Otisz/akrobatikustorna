<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — structural pages
 * Description: Publishes the pages the site's own structure depends on — the Schedule, Contact and Apply — and holds each of them at its slug. Declared in code rather than left to the admin, because a page that only exists in one database would not survive a fresh install, and the URLs (Uniform Resource Locators) are part of the site's search parity.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * The structural pages registered so far, as slug by the identifier WordPress
 * gave the page. A global rather than a list in one file, so that each page stays
 * declared in the file that owns it.
 *
 * @return array<int, string>
 */
function base_structural_pages(): array
{
    return $GLOBALS['base_structural_pages'] ?? [];
}

/**
 * Publishes a structural page once, on the first request after a deploy that has
 * never had one — adopting a page already published at the slug rather than
 * publishing a second one beside it — and from then on holds it at that slug.
 *
 * Deliberately not repeated: a Site Owner who deletes one of these pages has
 * decided something, and a page that grew back would be a haunting rather than a
 * feature.
 *
 * `$content` is a callable so that initial content nobody will use is never
 * built — a page that already exists never asks for it. It is installed when the
 * page is first created, and once more for a page an earlier deploy left empty;
 * anything already written is left alone, because from that moment the words
 * belong to the Site Owner rather than to this repo.
 */
function base_structural_page(string $option, string $slug, string $title, callable $content): void
{
    $id = (int) get_option($option);

    if ($id === 0) {
        $existing = get_page_by_path($slug);
        $id = $existing instanceof WP_Post ? $existing->ID : 0;
        $initial = (string) $content();

        if ($id === 0) {
            $inserted = wp_insert_post([
                'post_type' => 'page',
                'post_status' => 'publish',
                'post_title' => $title,
                'post_name' => $slug,
                'post_content' => $initial,
            ]);

            $id = is_int($inserted) ? $inserted : 0;
        } elseif ($initial !== '' && trim($existing->post_content) === '') {
            wp_update_post(['ID' => $id, 'post_content' => $initial]);
        }

        if ($id > 0) {
            update_option($option, $id, false);
        }
    }

    if ($id > 0) {
        $GLOBALS['base_structural_pages'][$id] = $slug;
    }
}

/**
 * Holds every structural page at its slug. Retitling a page renames its URL along
 * with it, which here would silently break the club's search rankings and every
 * link a parent has saved — and the Site Owner has no way to see that happen.
 */
add_filter('wp_insert_post_data', static function (array $data, array $post): array {
    $slug = base_structural_pages()[(int) ($post['ID'] ?? 0)] ?? null;

    if ($slug !== null && $data['post_status'] !== 'trash') {
        $data['post_name'] = $slug;
    }

    return $data;
}, 10, 2);
