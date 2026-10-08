/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base matches the GitHub Pages path: https://<user>.github.io/plant-it/
export default defineConfig({
  base: '/plant-it/',
  plugins: [react()],
  test: {
    include: ['src/**/*.test.ts'],
    passWithNoTests: true,
  },
})
