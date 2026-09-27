<?php declare(strict_types=1); ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class('font-sans text-ink bg-paper'); ?>>
<?php wp_body_open(); ?>

<a class="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-paper focus:px-4 focus:py-2" href="#main">
    <?php esc_html_e('Ugrás a tartalomra', 'base'); ?>
</a>

<header class="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
    <div class="wrap flex h-[4.5rem] items-center gap-6">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="flex shrink-0 items-center gap-3 no-underline">
            <?php echo Base\logo('h-11 w-auto'); ?>
            <span class="sr-only"><?php bloginfo('name'); ?></span>
        </a>

        <nav class="ml-auto hidden lg:block" aria-label="<?php esc_attr_e('Főmenü', 'base'); ?>">
            <?php Base\nav_menu('primary', 'nav-list'); ?>
        </nav>

        <?php if ($apply = Base\page_link(BASE_APPLY_SLUG)) : ?>
            <a class="btn btn-primary hidden shrink-0 lg:inline-flex" href="<?php echo esc_url($apply); ?>">
                <?php esc_html_e('Jelentkezés', 'base'); ?>
            </a>
        <?php endif; ?>

        <button type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu"
                class="btn btn-secondary ml-auto lg:hidden">
            <?php esc_html_e('Menü', 'base'); ?>
        </button>
    </div>

    <div id="mobile-menu" data-menu hidden class="border-t border-line px-5 py-5 lg:hidden">
        <nav aria-label="<?php esc_attr_e('Főmenü', 'base'); ?>">
            <?php Base\nav_menu('primary', 'nav-list nav-list-stacked'); ?>
        </nav>
        <?php if ($apply = Base\page_link(BASE_APPLY_SLUG)) : ?>
            <a class="btn btn-primary mt-5 w-full" href="<?php echo esc_url($apply); ?>">
                <?php esc_html_e('Jelentkezés', 'base'); ?>
            </a>
        <?php endif; ?>
    </div>
</header>

<main id="main">
