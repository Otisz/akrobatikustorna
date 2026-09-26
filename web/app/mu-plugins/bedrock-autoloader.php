<?php
/**
 * Plugin Name: Bedrock Autoloader
 * Description: An mu-plugin autoloader, so Composer-installed mu-plugins in their own directories are loaded.
 * Author: Roots
 */

if (!class_exists('Roots\\Bedrock\\Autoloader')) {
    require_once dirname(__DIR__, 3) . '/vendor/roots/bedrock-autoloader/src/Autoloader.php';
}

new Roots\Bedrock\Autoloader();
