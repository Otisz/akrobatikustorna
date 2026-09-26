<?php

declare(strict_types=1);

require_once __DIR__ . '/inc/assets.php';
require_once __DIR__ . '/inc/table.php';
require_once __DIR__ . '/inc/template-tags.php';

add_action('after_setup_theme', function (): void {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', ['height' => 235, 'width' => 256, 'flex-height' => true, 'flex-width' => true]);
    add_theme_support('html5', ['search-form', 'gallery', 'caption', 'style', 'script', 'navigation-widgets']);
    add_theme_support('responsive-embeds');
    // theme.json declares a wide size; without this the Site Owner has no control
    // to put a table across it, or to take one back.
    add_theme_support('align-wide');
    add_theme_support('wp-block-styles');
    add_theme_support('editor-styles');

    register_nav_menus([
        'primary' => __('Főmenü', 'base'),
        'footer' => __('Lábléc menü', 'base'),
    ]);

    Base\Assets\enqueue_editor();
});

add_action('wp_enqueue_scripts', 'Base\Assets\enqueue_front_end');
add_action('wp_head', 'Base\Assets\preload_fonts', 1);

add_filter('render_block', 'Base\\Table\\label_cells', 10, 2);

add_filter('excerpt_length', fn (): int => 24);
add_filter('excerpt_more', fn (): string => '…');
