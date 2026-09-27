<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — SEO (Search Engine Optimisation)
 * Description: Narrows the SEO plugin to the content that has a page of its own. A title and a description are the Site Owner's to write, but only where a visitor can land: the content types whose own address redirects to their listing are offered no fields, no column and no place in the sitemap.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * The content types whose single address is a redirect to their listing —
 * `base-documents.php`, `base-videos.php`, `base-departments.php` and
 * `base-recommended-pages.php` each send a visitor to the one page that holds
 * them. A search engine therefore never indexes one of these on its own, and a
 * title written for one would be read by nobody.
 *
 * Listed here rather than derived, because nothing WordPress records about a
 * post type says whether it redirects: that lives in each type's own
 * `template_redirect`, and a list a reviewer can read beats a guess.
 *
 * @return array<int, string>
 */
function base_seo_listing_only_post_types(): array
{
    return [
        BASE_DOCUMENT_POST_TYPE,
        BASE_VIDEO_POST_TYPE,
        BASE_DEPARTMENT_POST_TYPE,
        BASE_RECOMMENDED_PAGE_POST_TYPE,
    ];
}

/**
 * Withholds the fields from their editing screens, and the column the plugin
 * grades them in from their admin lists. A Document is a title and a file; a
 * Video is a title and a link. Both lists already print the one thing worth
 * seeing at a glance, and neither has a page to grade.
 *
 * @param array<int, string> $types
 * @return array<int, string>
 */
function base_seo_without_listing_only(array $types): array
{
    return array_values(array_diff($types, base_seo_listing_only_post_types()));
}

add_filter('slim_seo_meta_box_post_types', 'base_seo_without_listing_only');
add_filter('slim_seo_admin_columns_post', 'base_seo_without_listing_only');

/**
 * And leaves each of them out of the sitemap, which would otherwise offer a
 * search engine a list of addresses that all answer with a redirect. Only the
 * entries are dropped: the plugin writes each content type's listing into the
 * same file, and the listings are the pages the club wants found.
 */
add_filter('slim_seo_sitemap_post_ignore', static function (bool $ignore, WP_Post $post): bool {
    return $ignore || in_array($post->post_type, base_seo_listing_only_post_types(), true);
}, 10, 2);
