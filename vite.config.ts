// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: '',
  build: {
    minify: false,
    rollupOptions: {
      output: {
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
});
