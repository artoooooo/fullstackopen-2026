import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true
      }
    }
  },
  test: {
    tags: [{ name:'5.13' }, { name:'5.14' }, { name:'5.15' }, { name:'5.16' }, { name:'5.27' }],
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js',
  }
})
