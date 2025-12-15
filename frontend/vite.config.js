import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html'
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // hook that ensures redirects file gets copied
  publicDir: 'public',
  buildEnd() {
    this.emitFile({
      type: 'asset',
      fileName: '_redirects',
      source: '/* /index.html 200'
    })
  }
})
