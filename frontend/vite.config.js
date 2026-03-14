import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // THÊM DÒNG NÀY
import path from 'path' 

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // THÊM DÒNG NÀY VÀO PLUGIN
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})