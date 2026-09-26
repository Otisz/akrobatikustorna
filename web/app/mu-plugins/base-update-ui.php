<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — update interface removal
 * Description: Withdraws the ability to install or update code from the admin. Core and plugin versions are pinned in composer.json, so anything installed this way would be discarded by the next deploy.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Capabilities that install or update code. Revoking the capability — rather
 * than blocking screens by name — also covers the AJAX (Asynchronous JavaScript
 * And XML) install handlers and `update.php`, which are reachable directly.
 */
const BASE_CODE_INSTALL_CAPS = [
    'install_plugins',
    'install_themes',
    'update_plugins',
    'update_themes',
    'update_core',
    'update_languages',
    'upload_plugins',
    'upload_themes',
];

add_filter('map_meta_cap', static function (array $caps, string $cap): array {
    return in_array($cap, BASE_CODE_INSTALL_CAPS, true) ? ['do_not_allow'] : $caps;
}, 10, 2);

/**
 * The capability check alone leaves dead menu entries and nags pointing at
 * screens that now refuse the request.
 */
add_action('admin_menu', static function (): void {
    remove_submenu_page('index.php', 'update-core.php');
    remove_submenu_page('plugins.php', 'plugin-install.php');
    remove_submenu_page('themes.php', 'theme-install.php');
}, 999);

add_action('admin_init', static function (): void {
    remove_action('admin_notices', 'update_nag', 3);
    remove_action('network_admin_notices', 'update_nag', 3);
});

add_filter('wp_get_update_data', static fn (): array => [
    'counts' => ['plugins' => 0, 'themes' => 0, 'wordpress' => 0, 'translations' => 0, 'total' => 0],
    'title' => '',
]);

/**
 * Core's own auto-updater still runs; only plugins and themes are pinned hard
 * enough that an update would be reverted by the next deploy.
 */
add_filter('auto_update_plugin', '__return_false');
add_filter('auto_update_theme', '__return_false');
