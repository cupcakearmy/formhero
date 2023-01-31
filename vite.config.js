import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  root: './examples',
  plugins: [react()],
  build: {
    outDir: '../docs',
  },
})
