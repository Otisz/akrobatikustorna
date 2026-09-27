<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — mail
 * Description: Settles how the site's mail behaves in code rather than on a settings screen, leaving only the mailbox and its password to the environment. The transport itself is configured by the constants in `config/application.php`.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * What the site's mail looks like to whoever receives it, and which of the
 * plugin's extras the club has any use for — filtered over whatever is stored,
 * the way `base-analytics.php` and `base-permalinks.php` do it. The Site Owner
 * holds the Editor role and cannot reach this plugin's settings screen, and mail
 * that worked only because somebody once ran a setup wizard would not survive a
 * fresh install.
 *
 * The mailbox, its password and the address mail is sent from are not here: those
 * belong to an environment, and are read from `.env` into constants the plugin
 * prefers over anything stored. See
 * `docs/adr/0010-mail-goes-over-smtp-because-a-lost-password-reset-is-a-lockout.md`.
 *
 * @param mixed $stored
 * @return mixed
 */
function base_mail_settings($stored)
{
    if (!is_array($stored)) {
        return $stored;
    }

    return array_merge($stored, [
        'mail' => array_merge((array) ($stored['mail'] ?? []), [
            // The club as the sender, rather than the "WordPress" core would use.
            // Taken from the site's own title so that the name in a recipient's
            // inbox is the name the Site Owner sees in the admin, and forced,
            // because core hands its default to every email core sends.
            'from_name' => get_bloginfo('name'),
            'from_name_force' => true,
        ]),

        'general' => array_merge((array) ($stored['general'] ?? []), [
            // A weekly report on how much mail the site sent, addressed to the
            // administrator. Nobody reads that inbox, and a club of this size
            // sends a handful of emails a month.
            'summary_report_email_disabled' => true,
        ]),
    ]);
}

add_filter('wp_mail_smtp_populate_options', 'base_mail_settings');

/**
 * Keeps the plugin's setup wizard out of the way. Activating it sets a transient
 * that hijacks the next admin page an administrator opens, to walk them through
 * choosing a mailer — which is already chosen, in `config/application.php`, and
 * cannot be changed from there. The Site Owner never sees it either way: the
 * redirect asks for `activate_plugins`, which the Editor role does not have.
 */
add_filter('option_wp_mail_smtp_activation_prevent_redirect', '__return_true');
add_filter('default_option_wp_mail_smtp_activation_prevent_redirect', '__return_true');
