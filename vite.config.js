import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:  ['react', 'react-dom', 'react-router-dom'],
          editor:  ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-image', '@tiptap/extension-link', '@tiptap/extension-placeholder', '@tiptap/extension-text-align', '@tiptap/extension-underline'],
          query:   ['@tanstack/react-query'],
          motion:  ['framer-motion'],
          helmet:  ['react-helmet-async'],
          share:   ['react-share'],
          dates:   ['date-fns']
        }
      }
    },
    minify: 'esbuild',
    chunkSizeWarningLimit: 500
  }
})