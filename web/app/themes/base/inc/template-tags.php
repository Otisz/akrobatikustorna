<?php

declare(strict_types=1);

namespace Base;

/**
 * The permalink of a page at a known path, or null while that page is still to be created.
 * Lets the layout link to structural pages without hard-coding a URL (Uniform Resource Locator) that 404s.
 */
function page_link(string $path): ?string
{
    $page = get_page_by_path($path);

    return $page instanceof \WP_Post ? get_permalink($page) : null;
}

/**
 * The permalink of the Posts listing, or null while the Site Owner has yet to
 * assign a page to it.
 */
function news_link(): ?string
{
    $page = (int) get_option('page_for_posts');
    $link = $page > 0 ? get_permalink($page) : false;

    return is_string($link) ? $link : null;
}

/**
 * The Site Owner's custom logo when one is set, otherwise the club's own mark.
 */
function logo(string $classes): string
{
    $custom = get_theme_mod('custom_logo');

    if ($custom) {
        $image = wp_get_attachment_image($custom, 'full', false, ['class' => $classes, 'alt' => '']);

        if ($image) {
            return $image;
        }
    }

    return sprintf(
        '<img src="%s" class="%s" width="256" height="235" alt="" decoding="async">',
        esc_url(get_theme_file_uri('assets/images/logo.png')),
        esc_attr($classes)
    );
}

/**
 * The home page's own featured image, falling back to a club photograph until the
 * Site Owner sets one.
 */
function front_page_image(?\WP_Post $page): string
{
    if ($page instanceof \WP_Post && has_post_thumbnail($page)) {
        return get_the_post_thumbnail($page, 'large', [
            'class' => 'h-full w-full object-cover',
            'fetchpriority' => 'high',
        ]);
    }

    return sprintf(
        '<img src="%s" class="h-full w-full object-cover" width="1183" height="1600" alt="%s" fetchpriority="high">',
        esc_url(get_theme_file_uri('assets/images/front-page-fallback.jpg')),
        esc_attr__('A klub sportolói gúlát tartanak a tengerparton', 'base')
    );
}

/**
 * The published Slides, in the order the Site Owner put them in. A Slide is its
 * image, so one saved without a picture yet is left out rather than shown as a
 * blank panel. Uncapped: silently dropping a Slide the Site Owner published
 * would be harder to understand than a longer carousel.
 */
function slides(): \WP_Query
{
    return new \WP_Query([
        'post_type' => \BASE_SLIDE_POST_TYPE,
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => \BASE_SLIDE_ORDER,
        'meta_key' => '_thumbnail_id',
        'no_found_rows' => true,
    ]);
}

/**
 * Where a Slide points, or null when the Site Owner left the link empty. Read
 * from post meta rather than through the fields plugin, so the template renders
 * whether or not that plugin is loaded.
 */
function slide_link(int $id): ?string
{
    $link = trim((string) get_post_meta($id, \BASE_SLIDE_LINK_META, true));

    return $link === '' ? null : $link;
}

/**
 * Falls back to the site's top-level pages, so the navigation is never empty
 * before the Site Owner has built a menu.
 */
function nav_menu(string $location, string $classes): void
{
    wp_nav_menu([
        'theme_location' => $location,
        'container' => false,
        'menu_class' => $classes,
        'depth' => 1,
        // wp_page_menu() puts menu_class on a container, not the list, so the list
        // markup is supplied directly.
        'fallback_cb' => fn () => wp_page_menu([
            'container' => false,
            'before' => sprintf('<ul class="%s">', esc_attr($classes)),
            'after' => '</ul>',
            'depth' => 1,
            'show_home' => false,
        ]),
    ]);
}

/**
 * What a Trainer does at the club, or null when the Site Owner left it empty.
 * Read from post meta rather than through the fields plugin, so the template
 * renders whether or not that plugin is loaded.
 */
function trainer_role(int $id): ?string
{
    $role = trim((string) get_post_meta($id, \BASE_TRAINER_ROLE_META, true));

    return $role === '' ? null : $role;
}

/**
 * The file a Document offers, described in the terms the listing prints: the
 * address to download it from, the name to save it under, its extension and its
 * size. Null
 * where the Site Owner has yet to choose a file, or where the one they chose has
 * since been deleted from the media library — a row that downloads nothing is
 * worse than no row.
 *
 * Read from post meta rather than through the fields plugin, so the template
 * renders whether or not that plugin is loaded.
 *
 * @return array{url: string, name: string, extension: string, size: ?string}|null
 */
function document_file(int $id): ?array
{
    $file = (int) get_post_meta($id, \BASE_DOCUMENT_FILE_META, true);
    $url = $file > 0 ? wp_get_attachment_url($file) : false;
    $path = $file > 0 ? get_attached_file($file) : false;

    if (!is_string($url) || !is_string($path)) {
        return null;
    }

    $name = wp_basename($path);
    $bytes = is_file($path) ? filesize($path) : false;

    return [
        'url' => $url,
        'name' => $name,
        // What a parent recognises: whether this opens in a reader or in a word
        // processor, before they click it.
        'extension' => strtoupper(pathinfo($name, PATHINFO_EXTENSION)),
        'size' => is_int($bytes) ? size_format($bytes) : null,
    ];
}
