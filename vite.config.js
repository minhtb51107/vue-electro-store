import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }), // Hỗ trợ Vuetify tree-shaking
  ],
  resolve: {
    alias: {
      // Định nghĩa '@' trỏ về thư mục './src'
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})