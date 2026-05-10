import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    sourcemap: false,
    minify: 'esbuild',
    cssMinify: true
  },
  server: {
    port: 5173
  }
});
