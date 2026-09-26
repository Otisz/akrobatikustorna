<?php declare(strict_types=1); ?>
</main>

<footer class="mt-24 bg-ink text-paper">
    <div class="wrap py-16">
        <div class="grid gap-12 md:grid-cols-[minmax(0,1fr)_auto]">
            <div class="max-w-[38ch]">
                <?php echo Base\logo('h-16 w-auto'); ?>
                <p class="mt-5 font-display text-2xl leading-tight"><?php bloginfo('name'); ?></p>
                <?php if ($tagline = get_bloginfo('description')) : ?>
                    <p class="mt-3 text-base text-line"><?php echo esc_html($tagline); ?></p>
                <?php endif; ?>
            </div>

            <?php if (has_nav_menu('footer')) : ?>
                <nav aria-label="<?php esc_attr_e('Lábléc menü', 'base'); ?>">
                    <?php Base\nav_menu('footer', 'nav-list nav-list-stacked nav-list-on-ink'); ?>
                </nav>
            <?php endif; ?>
        </div>

        <p class="mt-14 border-t border-white/15 pt-6 text-sm text-line">
            <?php echo esc_html(sprintf('© %s %s', wp_date('Y'), get_bloginfo('name'))); ?>
        </p>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
