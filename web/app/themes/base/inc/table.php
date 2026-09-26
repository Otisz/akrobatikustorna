<?php

declare(strict_types=1);

namespace Base\Table;

/**
 * A table stacks into a card per row on a phone, where seven columns of training
 * times would otherwise have to be scrolled sideways. Stacked, a time sits on
 * its own with nothing above it saying which day it is — so each cell is given
 * the heading of its column to carry, and the stylesheet prints it back.
 */
function label_cells(string $html, array $block): string
{
    if (($block['blockName'] ?? '') !== 'core/table') {
        return $html;
    }

    $headings = column_headings($html);

    if ($headings === []) {
        return $html;
    }

    $tags = new \WP_HTML_Tag_Processor($html);
    $in_body = false;
    $column = 0;

    while ($tags->next_tag()) {
        switch ($tags->get_tag()) {
            case 'THEAD':
                $in_body = false;
                break;
            case 'TBODY':
                $in_body = true;
                break;
            case 'TR':
                $column = 0;
                break;
            case 'TD':
                if ($in_body && isset($headings[$column])) {
                    $tags->set_attribute('data-label', $headings[$column]);
                }

                $column++;
                break;
        }
    }

    return $tags->get_updated_html();
}

/**
 * The text of the head row's cells, in column order, or none when the Site Owner
 * gave the table no header row — in which case there is nothing to label with.
 */
function column_headings(string $html): array
{
    if (!preg_match('~<thead\b[^>]*>(.*?)</thead>~is', $html, $head)) {
        return [];
    }

    if (!preg_match_all('~<th\b[^>]*>(.*?)</th>~is', $head[1], $cells)) {
        return [];
    }

    return array_map(
        static fn (string $cell): string => trim(wp_strip_all_tags($cell)),
        $cells[1]
    );
}
