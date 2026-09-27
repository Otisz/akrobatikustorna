<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — Contact
 * Description: The club's contact details, edited on one screen and surfaced on the Contact page at /kapcsolat and in the footer of every page. Site options rather than a content type, because there is exactly one set of them — see docs/adr/0006-contact-details-are-site-options-on-an-editor-reachable-screen.md.
 */

if (!defined('ABSPATH')) {
    exit;
}

/** The path the outgoing site published its contact details under. */
const BASE_CONTACT_SLUG = 'kapcsolat';

/** Which page is the Contact page, so that the slug can be held to it afterwards. */
const BASE_CONTACT_PAGE_OPTION = 'base_contact_page';

/**
 * The option group and the admin screen the details are edited on. The group name
 * is what `options.php` reads the screen's capability off, so the two are the same
 * string in all but the separator WordPress requires of each.
 */
const BASE_CONTACT_OPTION_GROUP = 'base_contact';
const BASE_CONTACT_SCREEN = 'base-contact';

/**
 * Each detail the club publishes, in the order the screen and the Contact page
 * both read them. One declaration, because a detail is otherwise five things to
 * keep in step: an option, a sanitiser, a field on the screen, a default, and a
 * line on the page.
 *
 * `default` is the detail as the outgoing site carried it, transferred by hand.
 * It is a default rather than a row written into the database, so that a fresh
 * install — staging, or production before the Site Owner has opened the screen —
 * comes up with the club's real details; the moment they save, the value is
 * theirs.
 *
 * Both telephone numbers and both email addresses are separate details rather
 * than a list, because the fields plugin's free edition has no repeater and the
 * club has exactly two of each: an officer a parent can ring, and the address
 * they can write to.
 *
 * @return array<string, array{section: string, label: string, type: string, default: string, instructions?: string}>
 */
function base_contact_details(): array
{
    return [
        'base_contact_phone_primary_label' => [
            'section' => 'phones',
            'label' => __('Első szám — kinek a száma', 'base'),
            'type' => 'text',
            'default' => 'Mester Gábor elnök',
        ],
        'base_contact_phone_primary' => [
            'section' => 'phones',
            'label' => __('Első telefonszám', 'base'),
            'type' => 'tel',
            'default' => '+36 20 311 1919',
        ],
        'base_contact_phone_secondary_label' => [
            'section' => 'phones',
            'label' => __('Második szám — kinek a száma', 'base'),
            'type' => 'text',
            'default' => 'Szücsi Ildikó alelnök',
        ],
        'base_contact_phone_secondary' => [
            'section' => 'phones',
            'label' => __('Második telefonszám', 'base'),
            'type' => 'tel',
            'default' => '+36 20 983 1741',
            'instructions' => __('Hagyd üresen, ha csak egy számot szeretnél közzétenni.', 'base'),
        ],
        'base_contact_email_primary' => [
            'section' => 'emails',
            'label' => __('Első e-mail-cím', 'base'),
            'type' => 'email',
            'default' => 'akrobatikustorna@gmail.com',
        ],
        'base_contact_email_secondary' => [
            'section' => 'emails',
            'label' => __('Második e-mail-cím', 'base'),
            'type' => 'email',
            'default' => 'info@akrobatikustorna.hu',
            'instructions' => __('Hagyd üresen, ha csak egy címet szeretnél közzétenni.', 'base'),
        ],
        'base_contact_postal_address' => [
            'section' => 'places',
            'label' => __('Levelezési cím', 'base'),
            'type' => 'text',
            'default' => '1038 Budapest, Határ út 15.',
        ],
        'base_contact_venue_name' => [
            'section' => 'places',
            'label' => __('Tornacsarnok', 'base'),
            'type' => 'text',
            'default' => 'BMSZC Bláthy Ottó Titusz Informatikai Technikum',
        ],
        'base_contact_venue_address' => [
            'section' => 'places',
            'label' => __('A tornacsarnok címe', 'base'),
            'type' => 'text',
            'default' => '1032 Budapest, Bécsi út 134.',
            'instructions' => __('Ez a cím kerül a térkép alá, és erre keres rá a térkép, ha a lenti címet üresen hagyod.', 'base'),
        ],
        'base_contact_map' => [
            'section' => 'places',
            'label' => __('Térkép címe', 'base'),
            'type' => 'url',
            'default' => 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5386.781142626678!2d19.0254142!3d47.5407267!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741d965189cf915%3A0xd7c9db1c8efb4d8e!2sBudai%20Akrobatikus%20Sport%20Egyes%C3%BClet!5e0!3m2!1sen!2shu!4v1748309587347!5m2!1sen!2shu',
            'instructions' => __('Google Térkép → Megosztás → Térkép beágyazása → a <code>src="…"</code> után álló cím. Ha üresen hagyod, a térkép a tornacsarnok fenti címére keres rá.', 'base'),
        ],
    ];
}

/** The headings the screen groups the details under. */
function base_contact_sections(): array
{
    return [
        'phones' => __('Telefon', 'base'),
        'emails' => __('E-mail', 'base'),
        'places' => __('Címek és térkép', 'base'),
    ];
}

/**
 * One detail as it is published, or null where the Site Owner left it empty — an
 * empty line is left off the page rather than printed as a label with nothing
 * after it.
 */
function base_contact_detail(string $name): ?string
{
    // No default passed: WordPress hands the registered default back only to a
    // caller that asks for none of its own.
    $value = trim((string) get_option($name));

    return $value === '' ? null : $value;
}

/**
 * A telephone number as a browser can dial it: everything but the digits and the
 * country prefix removed, because a `tel:` address carrying the spaces a human
 * reads it by is not one a phone reliably understands.
 */
function base_contact_dialable(string $number): string
{
    return (string) preg_replace('#[^+0-9]#', '', $number);
}

/**
 * A telephone number as the Site Owner writes one: digits, and the punctuation a
 * Hungarian number is grouped by. Anything else is dropped rather than refused,
 * because a number pasted from a mail signature arrives with stray characters
 * and the screen is not the place to argue about them.
 */
function base_contact_sanitize_phone($value): string
{
    return trim((string) preg_replace('#[^+0-9()\-/ ]#', '', (string) $value));
}

/**
 * The address of the map frame, restricted to Google's own maps: a frame source
 * is the one detail on this screen that executes in a visitor's browser, and the
 * Site Owner is being asked for a map rather than for a page of someone else's
 * choosing.
 */
function base_contact_sanitize_map($value): string
{
    $url = sanitize_url((string) $value);

    if ($url === '') {
        return '';
    }

    $host = strtolower((string) wp_parse_url($url, PHP_URL_HOST));
    $path = (string) wp_parse_url($url, PHP_URL_PATH);

    if (preg_match('#^(www\.|maps\.)?google\.com$#', $host) === 1 && str_starts_with($path, '/maps')) {
        return $url;
    }

    // Refused out loud, and the previous map kept: silently emptying the field
    // would leave the Site Owner looking at a map they did not choose with
    // nothing on the screen to say why.
    add_settings_error(
        'base_contact_map',
        'base_contact_map',
        __('Ez nem Google Térkép-cím, ezért a korábbi térkép maradt. A Google Térkép Megosztás → Térkép beágyazása ablakában az <code>src="…"</code> után álló cím kell ide; a megosztásra kapott rövid cím nem jó.', 'base')
    );

    return (string) get_option('base_contact_map');
}

/**
 * The club's telephone numbers, each with whose number it is and the form a phone
 * can dial. A number the Site Owner left empty is left off rather than published
 * as a name with nothing to ring.
 *
 * @return list<array{label: ?string, number: string, dialable: string}>
 */
function base_contact_phones(): array
{
    $phones = [];

    foreach (['primary', 'secondary'] as $which) {
        $number = base_contact_detail("base_contact_phone_{$which}");

        if ($number === null) {
            continue;
        }

        $phones[] = [
            'label' => base_contact_detail("base_contact_phone_{$which}_label"),
            'number' => $number,
            'dialable' => base_contact_dialable($number),
        ];
    }

    return $phones;
}

/**
 * The club's email addresses, in the order the screen lists them, empty ones left
 * off.
 *
 * @return list<string>
 */
function base_contact_emails(): array
{
    return array_values(array_filter([
        base_contact_detail('base_contact_email_primary'),
        base_contact_detail('base_contact_email_secondary'),
    ]));
}

/**
 * Where the map looks, which is the club's own address as often as it is a link
 * the Site Owner pasted. Falling back to a search for the venue's address means
 * the page always carries a map: a Site Owner who cannot find Google's embed
 * address can simply leave the field empty.
 */
function base_contact_map_url(): ?string
{
    $pasted = base_contact_detail('base_contact_map');

    if ($pasted !== null) {
        return $pasted;
    }

    $venue = base_contact_detail('base_contact_venue_address');

    return $venue === null
        ? null
        : 'https://maps.google.com/maps?' . http_build_query(['q' => $venue, 'output' => 'embed']);
}

/**
 * The initial words of the Contact page. The details themselves are not part of
 * this: the page carries them from the options below, so that changing a number
 * never means editing a page.
 */
function base_contact_initial_content(): string
{
    return <<<HTML
    <!-- wp:paragraph -->
    <p>Kérdésed van, vagy szeretnéd megnézni az egyik edzésünket? Keress minket telefonon vagy e-mailben, és szívesen segítünk.</p>
    <!-- /wp:paragraph -->
    HTML;
}

/**
 * Registers each detail as a site option, with the sanitiser its kind calls for.
 * Registration is also what lets `options.php` save the screen at all, and what
 * makes the club's real details the answer to `get_option()` before anybody has
 * opened it.
 */
add_action('init', static function (): void {
    $sanitizers = [
        'tel' => 'base_contact_sanitize_phone',
        'email' => 'sanitize_email',
        'url' => 'base_contact_sanitize_map',
        'text' => 'sanitize_text_field',
    ];

    foreach (base_contact_details() as $name => $detail) {
        register_setting(BASE_CONTACT_OPTION_GROUP, $name, [
            'type' => 'string',
            'default' => $detail['default'],
            'sanitize_callback' => $sanitizers[$detail['type']],
            'show_in_rest' => false,
        ]);
    }

    base_structural_page(
        BASE_CONTACT_PAGE_OPTION,
        BASE_CONTACT_SLUG,
        __('Kapcsolat', 'base'),
        'base_contact_initial_content'
    );
}, 20);

/**
 * The details are edited on a screen of their own, in the admin menu beside the
 * content types. Not under Settings: that menu is an administrator's, and the
 * Site Owner holds the Editor role — see ADR-0006.
 */
add_action('admin_menu', static function (): void {
    add_menu_page(
        __('Kapcsolati adatok', 'base'),
        __('Kapcsolat', 'base'),
        'edit_pages',
        BASE_CONTACT_SCREEN,
        'base_contact_screen',
        'dashicons-phone',
        27
    );
});

/**
 * Lets the Editor role save the screen. `options.php` asks for `manage_options`
 * unless told otherwise, which would refuse the one person the screen is for.
 */
add_filter('option_page_capability_' . BASE_CONTACT_OPTION_GROUP, static fn (): string => 'edit_pages');

add_action('admin_init', static function (): void {
    foreach (base_contact_sections() as $section => $heading) {
        add_settings_section($section, $heading, null, BASE_CONTACT_SCREEN);
    }

    foreach (base_contact_details() as $name => $detail) {
        add_settings_field(
            $name,
            $detail['label'],
            'base_contact_field',
            BASE_CONTACT_SCREEN,
            $detail['section'],
            ['label_for' => $name] + $detail
        );
    }
});

/** One detail's input, in WordPress's own admin form furniture. */
function base_contact_field(array $detail): void
{
    printf(
        '<input type="%1$s" id="%2$s" name="%2$s" value="%3$s" class="%4$s">',
        esc_attr($detail['type']),
        esc_attr($detail['label_for']),
        esc_attr((string) get_option($detail['label_for'])),
        $detail['type'] === 'url' ? 'large-text code' : 'regular-text'
    );

    if (isset($detail['instructions'])) {
        printf(
            '<p class="description">%s</p>',
            wp_kses($detail['instructions'], ['code' => []])
        );
    }
}

/** The screen itself: every detail the club publishes, and a link to read them on. */
function base_contact_screen(): void
{
    $page = (int) get_option(BASE_CONTACT_PAGE_OPTION);
    $link = $page > 0 ? get_permalink($page) : false;
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

        <p class="description">
            <?php esc_html_e('Ezek az adatok a Kapcsolat oldalon és minden oldal láblécében jelennek meg.', 'base'); ?>
            <?php if (is_string($link)) : ?>
                <a href="<?php echo esc_url($link); ?>"><?php esc_html_e('Kapcsolat oldal megtekintése', 'base'); ?></a>
            <?php endif; ?>
        </p>

        <?php settings_errors(); ?>

        <form method="post" action="options.php">
            <?php
            settings_fields(BASE_CONTACT_OPTION_GROUP);
            do_settings_sections(BASE_CONTACT_SCREEN);
            submit_button();
            ?>
        </form>
    </div>
    <?php
}
