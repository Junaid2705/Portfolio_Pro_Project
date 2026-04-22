// vite.config.js
// IMPORTANT: The proxy below forwards all /api calls to Spring Boot
// This means you never get CORS errors during development

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,         // React runs on http://localhost:3000
    proxy: {
      '/api': {
        target: 'http://localhost:8080',   // Your Spring Boot server
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
