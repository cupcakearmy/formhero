/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: ['./test/setup.ts'],
    globals: false,
    environment: 'happy-dom',
  },
})
