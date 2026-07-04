import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from "@svgr/rollup";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
