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
      // Core analysis & chat
      '/analyze': { target: BACKEND, changeOrigin: true },
      '/history': { target: BACKEND, changeOrigin: true },
      '/chat': { target: BACKEND, changeOrigin: true },
      // Reports / downloads
      '/download': { target: BACKEND, changeOrigin: true },
      // Documents
      '/documents': { target: BACKEND, changeOrigin: true },
      '/upload-document': { target: BACKEND, changeOrigin: true },
      // AI document generator & voice
      '/ai': { target: BACKEND, changeOrigin: true },
      '/voice': { target: BACKEND, changeOrigin: true },
      // Simulator routes
      '/simulator': { target: BACKEND, changeOrigin: true },
      '/devils-advocate': { target: BACKEND, changeOrigin: true },
      '/execution-score': { target: BACKEND, changeOrigin: true },
      // Admin
      '/admin': { target: BACKEND, changeOrigin: true },
      // Workspaces & Tasks
      '/workspaces': { target: BACKEND, changeOrigin: true },
      '/workspace': { target: BACKEND, changeOrigin: true },
      '/action-items': { target: BACKEND, changeOrigin: true },
      '/notifications': { target: BACKEND, changeOrigin: true },
      // Strategic Decision Engine & Experiments
      '/decisions': { target: BACKEND, changeOrigin: true },
      '/experiments': { target: BACKEND, changeOrigin: true },
      '/intelligence': { target: BACKEND, changeOrigin: true },
      '/timeline': { target: BACKEND, changeOrigin: true },
      // Feedback, PMF, & Optimization
      '/feedback': { target: BACKEND, changeOrigin: true },
      '/optimization': { target: BACKEND, changeOrigin: true },
      '/pmf': { target: BACKEND, changeOrigin: true },
      '/founder-os': { target: BACKEND, changeOrigin: true },
      // Billing & Synthetic Evaluation
      '/billing': { target: BACKEND, changeOrigin: true },
      '/synthetic': { target: BACKEND, changeOrigin: true },
      // Socket.IO
      '/socket.io': { target: BACKEND, ws: true, changeOrigin: true },
    },
  },
})
