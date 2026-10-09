/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base matches the GitHub Pages path: https://<user>.github.io/Plant-it/
export default defineConfig({
  base: '/Plant-it/',
  plugins: [react()],
  test: {
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
  },
})
