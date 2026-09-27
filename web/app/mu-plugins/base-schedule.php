<?php
/**
 * Plugin Name: Budai Akrobatikus Sport Egyesület — Schedule
 * Description: The Schedule page at /edzeseink: the club's recurring weekly training times, held in a table the Site Owner edits in the block editor. Declared here rather than left to the admin, because a page that only exists in one database would not survive a fresh install, and the URL (Uniform Resource Locator) is part of the site's search parity.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * The path the outgoing site published the Schedule under, so links and search
 * results survive the rebuild.
 */
const BASE_SCHEDULE_SLUG = 'edzeseink';

/** Which page is the Schedule, so that the slug can be held to it afterwards. */
const BASE_SCHEDULE_PAGE_OPTION = 'base_schedule_page';

/**
 * The Schedule as the club runs it today, transferred by hand from the outgoing
 * site. Initial content only: it is installed when the page is first created and
 * never written again, because from that moment the times belong to the Site
 * Owner rather than to this file.
 *
 * The times are a table rather than a repeating field group because the fields
 * plugin's free edition has no repeater, and rows and columns are in any case
 * how the club already writes its weekly times down.
 */
function base_schedule_initial_content(): string
{
    $columns = ['Kategória', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];

    // Group, then one entry per day, empty where the group does not train.
    $groups = [
        ['Akrobatikus torna „A” kategória – hazai versenyzők', '16:00–19:00', '', '16:00–19:00', '', '18:00–20:00', ''],
        ['Akrobatikus torna „A” kategória – nemzetközi versenyzők', '16:00–19:30', '', '16:00–19:30', '', '18:00–20:30', '10:00–13:00'],
        ['Akrobatikus torna „A” kategória – Legend Team (EB, VB és kiemelt nemzetközi versenyek)', '16:00–19:30', '18:00–20:00', '16:00–19:30', '18:00–20:00', '18:00–20:30', '10:00–13:00'],
        ['Mozgásképzés, alap balett (a Legend Team versenyzőinek kötelező)', '', '', '', '', '17:00–18:00', ''],
        ['Akrobatikus torna „B” kategória – haladó versenyzők', '', '16:00–18:00', '', '', '16:00–18:00', '10:00–12:00 (felvehető)'],
        ['Akrobatikus torna „B” kategória – rekreációs csoport és kezdő versenyzők (8–22 éves korig)', '', '18:00–20:00', '', '16:00–18:00', '', '10:00–12:00 (felvehető)'],
        ['Magán és meghívásos akrobatika- és ugróedzések', '16:15–17:15', '18:00–19:00', '16:15–17:15', '18:00–19:00', '', ''],
        ['Torna előkészítő – Gyöngy és Gyémánt csoport (5–10 éves korig)', '', '16:00–17:30', '', '16:00–17:30', '', ''],
        ['Szabadidős örömtorna (8–12 éves korig)', '16:00–17:30 és 17:30–19:00', '', '16:00–17:30 és 17:30–19:00', '', '', ''],
    ];

    $categories = [
        'Gyöngy és Gyémánt csoportos',
        'Szabadidős sportoló, aki nem szeretne vagy valamilyen okból nem tud versenyezni',
        'Kezdő leigazolt B kategóriás vagy rajtengedélyes versenyző',
        'Haladó leigazolt B kategóriás vagy rajtengedélyes versenyző',
        'Felsőszintű leigazolt A kategóriás versenyző (hazai pontszerző verseny)',
        'Felsőszintű leigazolt A kategóriás versenyző (nemzetközi pontszerző verseny)',
        'Kiemelt szintű leigazolt A kategóriás versenyző (EB, VB, világkupa)',
    ];

    $head = base_schedule_cells($columns, 'th');
    $body = implode('', array_map(
        static fn (array $group): string => '<tr>' . base_schedule_cells($group, 'td') . '</tr>',
        $groups
    ));
    $list = implode('', array_map(
        static fn (string $item): string => '<!-- wp:list-item --><li>' . esc_html($item) . '</li><!-- /wp:list-item -->',
        $categories
    ));

    // Block markup has to match what the editor itself would save, or the Site
    // Owner opens the page to a block recovery notice. The table is wide because
    // seven columns do not fit the content width, and unfixed because the group
    // column is far longer than a time.
    return <<<HTML
    <!-- wp:paragraph -->
    <p><strong>Egyesületünkben felmérés (első próbaedzés) után kerülnek a gyerekek a megfelelő csoportba: a vezetőedző a jelenlegi teljesítményt nézi.</strong></p>
    <!-- /wp:paragraph -->

    <!-- wp:paragraph -->
    <p>Akrobatikus torna szakosztályunkban lehet valaki:</p>
    <!-- /wp:paragraph -->

    <!-- wp:list -->
    <ul class="wp-block-list">{$list}</ul>
    <!-- /wp:list -->

    <!-- wp:paragraph -->
    <p><strong>A megfelelő csoportba sorolást az első próbaedzés után az edző javaslata alapján a szülővel és a gyerekkel egyeztetve alakítjuk ki.</strong></p>
    <!-- /wp:paragraph -->

    <!-- wp:paragraph -->
    <p>Az alábbi időpontok hétről hétre ismétlődnek.</p>
    <!-- /wp:paragraph -->

    <!-- wp:table {"hasFixedLayout":false,"align":"wide"} -->
    <figure class="wp-block-table alignwide"><table><thead><tr>{$head}</tr></thead><tbody>{$body}</tbody></table></figure>
    <!-- /wp:table -->
    HTML;
}

/** One table row's cells, in the markup the table block saves. */
function base_schedule_cells(array $values, string $tag): string
{
    $scope = $tag === 'th' ? ' scope="col"' : '';

    return implode('', array_map(
        static fn (string $value): string => sprintf('<%1$s%2$s>%3$s</%1$s>', $tag, $scope, esc_html($value)),
        $values
    ));
}

/**
 * Publishes the Schedule and holds it at its slug — see `base-pages.php` for what
 * that means for a page the site's structure depends on. Late in `init`, so that
 * nothing about the page is written before the content types exist.
 */
add_action('init', static function (): void {
    base_structural_page(
        BASE_SCHEDULE_PAGE_OPTION,
        BASE_SCHEDULE_SLUG,
        __('Edzéseink', 'base'),
        'base_schedule_initial_content'
    );
}, 20);
