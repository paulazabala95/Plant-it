/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base matches the GitHub Pages path: https://<user>.github.io/Plant-it/
export default defineConfig({
  base: '/Plant-it/',
  plugins: [react()],
  build: {
    rollupOptions: {
      // The app, plus the sign-up landing page at /Plant-it/join/.
      input: {
        main: 'index.html',
        join: 'join/index.html',
      },
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
  },
})
