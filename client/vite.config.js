import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-redirects',
      closeBundle() {
        const src = resolve(__dirname, '_redirects')
        const dest = resolve(__dirname, 'dist', '_redirects')
        try {
          copyFileSync(src, dest)
          console.log('✅ _redirects file copied to dist/')
        } catch (err) {
          console.warn('⚠️ Could not copy _redirects file:', err.message)
        }
      }
    }
  ],
  server: {
    proxy: {
      '/api': process.env.BACKEND_URL || 'http://localhost:5000'
    }
  }
})
