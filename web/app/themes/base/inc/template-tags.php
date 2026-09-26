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
