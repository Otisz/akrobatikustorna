import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Assets are served straight from the theme directory, so the public base must be the
// theme's URL path rather than Vite's default '/'.
export default defineConfig({
  base: '/app/themes/base/build/',
  plugins: [tailwindcss()],
  build: {
    outDir: 'build',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: ['resources/css/app.css', 'resources/css/editor.css', 'resources/js/app.js'],
    },
  },
});
