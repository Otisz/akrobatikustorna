<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — Document file redirects
 * Description: Carries the outgoing site's /documents/ file addresses to the media library. A Document's file is the one URL (Uniform Resource Locator) the rebuild could not preserve, because the file moved; a parent who saved a link to a club form, and the search results that still point at one, arrive at the file rather than at nothing.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * The directory the outgoing site served the club's forms straight out of —
 * `public/documents/` on the `main` branch, which is where every link to a club
 * form still points.
 */
const BASE_DOCUMENT_LEGACY_PATH = '/documents/';

/**
 * The file a request under that path is asking for, or an empty string for a
 * request that is not. Decoded, because a form whose name has a space in it was
 * linked to with that space escaped.
 */
function base_document_legacy_request(string $uri): string
{
    $path = (string) parse_url($uri, PHP_URL_PATH);

    if (!str_starts_with($path, BASE_DOCUMENT_LEGACY_PATH)) {
        return '';
    }

    return wp_basename(rawurldecode($path));
}

/**
 * The comparable form of a file's name: what the outgoing site's name and the
 * media library's own have in common once WordPress has had its way with both.
 * Uploading turns a space into a hyphen and drops what a file system would
 * object to, so the outgoing name is put through the same treatment before the
 * two are held against each other, and case is set aside on top of that.
 *
 * Both sides of the comparison go through here, because a name normalised two
 * different ways is a redirect that silently stops matching.
 */
function base_document_file_key(string $name): string
{
    return strtolower(sanitize_file_name($name));
}

/**
 * The file each published Document currently offers, by its name on disk.
 *
 * This is what stands in for a hand-written list of redirects. The club has some
 * two dozen files on the outgoing site and no way of knowing which ones a search
 * engine still offers, so the site answers for the ones the Site Owner thought
 * worth transferring and lets the rest fall to a 404 — which is the same
 * judgement a list would have encoded, made by the person who has it to make,
 * and with nothing left to maintain afterwards. A form nobody transferred is a
 * form the club retired.
 *
 * @return array<string, int> the identifier of each file's attachment, by the
 *                             comparable form of its name
 */
function base_document_files(): array
{
    $documents = get_posts([
        'post_type' => BASE_DOCUMENT_POST_TYPE,
        'post_status' => 'publish',
        'numberposts' => -1,
        'fields' => 'ids',
    ]);

    $files = [];

    foreach ($documents as $document) {
        $attachment = (int) get_post_meta($document, BASE_DOCUMENT_FILE_META, true);
        $path = $attachment > 0 ? get_attached_file($attachment) : false;

        if (is_string($path)) {
            $files[base_document_file_key(wp_basename($path))] = $attachment;
        }
    }

    return $files;
}

/**
 * Sends a request for one of the outgoing site's files to wherever that file now
 * lives. Permanent, because the file is not coming back to the old address, and
 * a search engine has to be told so for the club's ranking to move with it.
 *
 * Hooked on the 404 rather than ahead of the request, so that nothing this site
 * does serve is intercepted on its way.
 */
add_action('template_redirect', static function (): void {
    if (!is_404()) {
        return;
    }

    $requested = base_document_legacy_request((string) ($_SERVER['REQUEST_URI'] ?? ''));

    if ($requested === '') {
        return;
    }

    $attachment = base_document_files()[base_document_file_key($requested)] ?? null;

    if ($attachment === null) {
        return;
    }

    $file = wp_get_attachment_url($attachment);

    if (!is_string($file)) {
        return;
    }

    wp_safe_redirect($file, 301);
    exit;
});
