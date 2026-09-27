<?php

declare(strict_types=1);

// The same details the Contact page carries, on every page: a parent who has
// scrolled to the bottom is looking for a way to get in touch.
$phones = base_contact_phones();
$emails = base_contact_emails();
$postal = base_contact_detail('base_contact_postal_address');
$contact = Base\contact_link();
?>
</main>

<footer class="mt-24 bg-ink text-paper">
    <div class="wrap py-16">
        <div class="grid gap-12 md:grid-cols-[minmax(0,1fr)_auto_auto]">
            <div class="max-w-[38ch]">
                <?php echo Base\logo('h-16 w-auto'); ?>
                <p class="mt-5 font-display text-2xl leading-tight"><?php bloginfo('name'); ?></p>
                <?php if ($tagline = get_bloginfo('description')) : ?>
                    <p class="mt-3 text-base text-line"><?php echo esc_html($tagline); ?></p>
                <?php endif; ?>
            </div>

            <?php if ($phones !== [] || $emails !== [] || $postal !== null) : ?>
                <div data-contact class="max-w-[28ch] text-base">
                    <p class="font-display text-lg font-semibold"><?php esc_html_e('Kapcsolat', 'base'); ?></p>

                    <?php foreach ($phones as $phone) : ?>
                        <p class="mt-3">
                            <a class="text-paper no-underline hover:text-gold"
                               href="tel:<?php echo esc_attr($phone['dialable']); ?>">
                                <?php echo esc_html($phone['number']); ?>
                            </a>
                            <?php if ($phone['label'] !== null) : ?>
                                <span class="block text-sm text-line"><?php echo esc_html($phone['label']); ?></span>
                            <?php endif; ?>
                        </p>
                    <?php endforeach; ?>

                    <?php foreach ($emails as $email) : ?>
                        <p class="mt-3">
                            <a class="break-all text-paper no-underline hover:text-gold"
                               href="mailto:<?php echo esc_attr($email); ?>">
                                <?php echo esc_html($email); ?>
                            </a>
                        </p>
                    <?php endforeach; ?>

                    <?php if ($postal !== null) : ?>
                        <p class="mt-3 text-line"><?php echo esc_html($postal); ?></p>
                    <?php endif; ?>

                    <?php if ($contact !== null) : ?>
                        <p class="mt-3">
                            <a class="text-gold" href="<?php echo esc_url($contact); ?>">
                                <?php esc_html_e('Kapcsolat és térkép', 'base'); ?>
                            </a>
                        </p>
                    <?php endif; ?>
                </div>
            <?php endif; ?>

            <?php if (has_nav_menu('footer')) : ?>
                <nav aria-label="<?php esc_attr_e('Lábléc menü', 'base'); ?>">
                    <?php Base\nav_menu('footer', 'nav-list nav-list-stacked nav-list-on-ink'); ?>
                </nav>
            <?php endif; ?>
        </div>

        <p class="mt-14 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-white/15 pt-6 text-sm text-line">
            <span><?php echo esc_html(sprintf('© %s %s', wp_date('Y'), get_bloginfo('name'))); ?></span>

            <?php if (base_analytics_answered()) : ?>
                <?php // Reopens the consent banner: the class is what the consent
                      // plugin's own script listens on, so there is no address here. ?>
                <a class="cn-revoke-cookie cursor-pointer text-line no-underline hover:text-gold" href="#">
                    <?php esc_html_e('Süti beállítások', 'base'); ?>
                </a>
            <?php endif; ?>
        </p>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
