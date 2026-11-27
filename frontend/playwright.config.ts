import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 100_000,
  expect: { timeout: 20_000 },
  outputDir: './node_modules/.cache/dinevina/f5-results',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    channel: process.env.PLAYWRIGHT_CHANNEL,
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5173 --strictPort',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: true,
  },
})
