import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { useDynamicPublicPath } from 'vite-plugin-dynamic-publicpath';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    useDynamicPublicPath({}),
  ],
  build: {
  },
});
