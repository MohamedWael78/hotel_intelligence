import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward any /predict, /health, /stats, /model calls to FastAPI
      '/predict': { target: 'http://localhost:8000', changeOrigin: true },
      '/health':  { target: 'http://localhost:8000', changeOrigin: true },
      '/stats':   { target: 'http://localhost:8000', changeOrigin: true },
      '/model':   { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
})
