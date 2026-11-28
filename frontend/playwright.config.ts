import { defineConfig, devices } from '@playwright/test'

// Runs the F5 customer suite (tests/) and the F7 partner suite (tests-e2e/)
// against a real FastAPI backend and the Vite dev server.
const python =
  process.env.E2E_PYTHON ??
  (process.platform === 'win32' ? '..\\.venv\\Scripts\\python.exe' : '../.venv/bin/python')

export default defineConfig({
  testDir: '.',
  testMatch: ['tests/**/*.spec.ts', 'tests-e2e/**/*.spec.ts'],
  timeout: 100_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  outputDir: './test-results',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    channel: process.env.PLAYWRIGHT_CHANNEL,
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: [
    {
      command: `${python} -m uvicorn app.main:app --app-dir ../backend --host 127.0.0.1 --port 8000`,
      url: 'http://127.0.0.1:8000/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5173 --strictPort',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
