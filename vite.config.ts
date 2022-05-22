import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import publicPath from 'vite-plugin-public-path';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/__vite_base_public_path_/' : '/',
  plugins: [
    vue(),
    publicPath({
      // A JS expression evaluates on client side each time when loading a new file
      // Should evaluate to a string ending with "/"
      publicPathExpression: 'window._publicPath',
      // See below for explanation of `options.html`
      html: true,
      // (Optional) The plugin will not rewrite any <script> tags whose src matches the provided filters
      // Useful for your external dependencies
      // Can be string, string[], RegExp or RegExp[]
      // excludeScripts: /^https:.*systemjs/,
    }),
  ],
  build: {
  },
});
