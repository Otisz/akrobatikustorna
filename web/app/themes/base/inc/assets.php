<?php

declare(strict_types=1);

namespace Base\Assets;

/**
 * The Vite build manifest, or an empty array when the theme has not been built yet.
 */
function manifest(): array
{
    static $manifest = null;

    if ($manifest === null) {
        $path = get_theme_file_path('build/.vite/manifest.json');
        $manifest = is_readable($path)
            ? (json_decode((string) file_get_contents($path), true) ?: [])
            : [];
    }

    return $manifest;
}

function manifest_entry(string $entry): ?array
{
    return manifest()[$entry] ?? null;
}

function asset_uri(string $file): string
{
    return get_theme_file_uri('build/' . $file);
}

function enqueue_front_end(): void
{
    $css = manifest_entry('resources/css/app.css');
    $js = manifest_entry('resources/js/app.js');

    if ($css !== null) {
        // Enqueued after global styles so theme chrome wins, while block content
        // stays governed by theme.json.
        wp_enqueue_style('base', asset_uri($css['file']), ['global-styles'], null);
    }

    if ($js !== null) {
        wp_enqueue_script('base', asset_uri($js['file']), [], null, ['strategy' => 'defer']);
    }
}

function enqueue_editor(): void
{
    $css = manifest_entry('resources/css/editor.css');

    if ($css !== null) {
        add_editor_style('build/' . $css['file']);
    }
}

/**
 * Preloads the Latin subsets only. The Latin Extended subsets carry the Hungarian
 * accents and load on demand, which keeps the critical path small.
 */
function preload_fonts(): void
{
    foreach (manifest() as $source => $entry) {
        if (! str_ends_with($source, '-latin.woff2')) {
            continue;
        }

        printf(
            '<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n",
            esc_url(asset_uri($entry['file']))
        );
    }
}
