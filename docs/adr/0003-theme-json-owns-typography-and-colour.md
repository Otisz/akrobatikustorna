# theme.json owns typography and colour; Tailwind owns layout

The theme carries two styling systems. `theme.json` defines the palette, the type scale and the element
styles, and WordPress turns them into global styles that apply identically to the published page and to the
block editor canvas. Tailwind, compiled by Vite from within the theme, styles everything `theme.json` cannot
reach: the header, the footer, the front page's opening section and the listing grids.

The split exists because the Site Owner composes pages in the block editor and must see what visitors will
see. `theme.json` is the only mechanism WordPress offers that reaches both surfaces from one definition. A
second editor stylesheet duplicating the Tailwind theme would drift, and drift is invisible until the Site
Owner publishes something that looks wrong.

## Consequences

- **Tailwind Preflight is not loaded.** Its element resets would override the global styles generated from
  `theme.json`, which are emitted with `:where()` and therefore carry no specificity. The theme ships a
  small hand-written reset instead, covering box sizing, body margin and focus rings only.
- **The theme's own component CSS (Cascading Style Sheets) is unlayered.** WordPress prints global styles without a cascade layer, and
  an unlayered rule beats a layered one however specific it is. Tailwind's utilities are imported unlayered
  and last, so a utility in the markup still wins over a component class.
- **The palette and the named type sizes are written twice**, in `theme.json` and in the Tailwind `@theme`
  block. They have to be changed together; `resources/css/tokens.css` says so at the top.
- **Layout widths are written once.** The `.wrap` class reads `theme.json`'s `wideSize` through the custom
  property WordPress generates from it, so templates carry no width literal.
- The editor stylesheet carries the self-hosted `@font-face` rules and nothing else.
