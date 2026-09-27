<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — Google Forms
 * Description: Turns a Google Form's own address, pasted on a line of its own, into the form itself. This is how the Apply page carries the club's application form, and how the Site Owner embeds a signup or a survey in a page of their own without being asked to understand embeds.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * What a Google Form's address looks like. The identifier is captured so that the
 * frame is built from it rather than from the address as pasted, which arrives
 * carrying whatever Google's own Send dialog appended to it.
 */
const BASE_GOOGLE_FORM_PATTERN = '#^https://docs\.google\.com/forms/d/e/([\w-]+)/viewform#i';

/**
 * How tall a Google Form is cannot be measured: the frame is another origin, so
 * its content is not readable from this page. A form is therefore given a height
 * long enough for most of one, and scrolls within itself beyond that.
 */
const BASE_GOOGLE_FORM_HEIGHT = 1200;

/** The frame Google serves a form in, which is not the page it serves a browser. */
function base_google_form_url(string $identifier): string
{
    return sprintf('https://docs.google.com/forms/d/e/%s/viewform?embedded=true', $identifier);
}

/**
 * Registers the address as something WordPress can embed, which is what makes a
 * pasted link become the form: the editor's own autoembed runs every standalone
 * address in a page through the handlers registered here.
 *
 * Google publishes no oEmbed service for Forms, so there is nothing for WordPress
 * to discover — without this the Site Owner would be left writing an `iframe` by
 * hand in a Custom HTML block, which is exactly the knowledge the site is meant
 * not to require of them.
 */
add_action('init', static function (): void {
    wp_embed_register_handler(
        'base_google_form',
        BASE_GOOGLE_FORM_PATTERN,
        static function (array $matches): string {
            // Only the frame itself, with no wrapper: autoembed substitutes the
            // result into the paragraph the address stood in, and a block element
            // inside a paragraph is markup no browser keeps.
            return sprintf(
                '<iframe class="google-form" src="%s" title="%s" loading="lazy" referrerpolicy="no-referrer-when-downgrade" height="%d"></iframe>',
                esc_url(base_google_form_url($matches[1])),
                esc_attr__('Google-űrlap', 'base'),
                BASE_GOOGLE_FORM_HEIGHT
            );
        }
    );
});
