<?php

/**
 * The club's contact details and the map of where it trains, rendered under
 * whatever the Site Owner wrote on the Contact page. The details come from the
 * Contact screen rather than from the page's own body, so that changing a
 * telephone number is never editing a page — see
 * docs/adr/0006-contact-details-are-site-options-on-an-editor-reachable-screen.md.
 */

declare(strict_types=1);

$phones = base_contact_phones();
$emails = base_contact_emails();
$postal = base_contact_detail('base_contact_postal_address');
$venue = base_contact_detail('base_contact_venue_name');
$venue_address = base_contact_detail('base_contact_venue_address');
$map = base_contact_map_url();
?>

<section data-contact-details class="wrap pb-20">
    <div class="grid gap-4 sm:grid-cols-2">
        <?php foreach ($phones as $phone) : ?>
            <div class="rounded-[var(--radius-card)] border border-line bg-paper px-5 py-4">
                <p class="text-sm text-ink-soft">
                    <?php echo esc_html($phone['label'] ?? __('Telefon', 'base')); ?>
                </p>
                <p class="mt-1">
                    <a class="font-display text-lg font-semibold text-ink no-underline hover:text-brand-deep"
                       href="tel:<?php echo esc_attr($phone['dialable']); ?>">
                        <?php echo esc_html($phone['number']); ?>
                    </a>
                </p>
            </div>
        <?php endforeach; ?>

        <?php if ($emails !== []) : ?>
            <div class="rounded-[var(--radius-card)] border border-line bg-paper px-5 py-4">
                <p class="text-sm text-ink-soft"><?php esc_html_e('E-mail', 'base'); ?></p>
                <?php foreach ($emails as $email) : ?>
                    <p class="mt-1">
                        <a class="font-display text-lg font-semibold break-all text-ink no-underline hover:text-brand-deep"
                           href="mailto:<?php echo esc_attr($email); ?>">
                            <?php echo esc_html($email); ?>
                        </a>
                    </p>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <?php if ($postal !== null) : ?>
            <div class="rounded-[var(--radius-card)] border border-line bg-paper px-5 py-4">
                <p class="text-sm text-ink-soft"><?php esc_html_e('Levelezési cím', 'base'); ?></p>
                <p data-postal-address class="mt-1 font-display text-lg font-semibold">
                    <?php echo esc_html($postal); ?>
                </p>
            </div>
        <?php endif; ?>
    </div>

    <?php if ($map !== null) : ?>
        <div class="mt-4 rounded-[var(--radius-card)] border border-line bg-paper px-5 py-4">
            <?php if ($venue !== null || $venue_address !== null) : ?>
                <p class="text-sm text-ink-soft"><?php esc_html_e('Tornacsarnok', 'base'); ?></p>
                <?php if ($venue !== null) : ?>
                    <p class="mt-1 font-display text-lg font-semibold"><?php echo esc_html($venue); ?></p>
                <?php endif; ?>
                <?php if ($venue_address !== null) : ?>
                    <p class="mt-1 text-ink-soft"><?php echo esc_html($venue_address); ?></p>
                <?php endif; ?>
            <?php endif; ?>

            <?php // Loaded lazily: the map is below the details a visitor came for, and it is another origin's script. ?>
            <div class="mt-4 aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-surface md:aspect-[16/9]">
                <iframe data-contact-map class="h-full w-full border-0"
                        src="<?php echo esc_url($map); ?>"
                        title="<?php echo esc_attr(sprintf(__('%s a térképen', 'base'), $venue ?? get_bloginfo('name'))); ?>"
                        loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
            </div>
        </div>
    <?php endif; ?>
</section>
