import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' — сайт работает на GitHub Pages из любого подпути репозитория
export default defineConfig({
  base: './',
  plugins: [react()],
})
