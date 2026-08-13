import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BACKEND = 'http://127.0.0.1:8000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false,
    proxy: {
      // Auth routes
      '/auth': { target: BACKEND, changeOrigin: true },
      // Core analysis
      '/analyze': { target: BACKEND, changeOrigin: true },
      '/history': { target: BACKEND, changeOrigin: true },
      '/chat': { target: BACKEND, changeOrigin: true },
      // Reports / downloads
      '/download': { target: BACKEND, changeOrigin: true },
      // Documents
      '/documents': { target: BACKEND, changeOrigin: true },
      '/upload-document': { target: BACKEND, changeOrigin: true },
      // AI document generator
      '/ai': { target: BACKEND, changeOrigin: true },
      // Startup Operating System
      '/startup': { target: BACKEND, changeOrigin: true },
    },
  },
})
