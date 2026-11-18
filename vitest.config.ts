import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: ['src/utils.ts'],
      thresholds: { 100: true },
    },
    exclude: ['dist/**', 'node_modules/**'],
    globals: true,
    pool: 'threads',
    reporters: ['dot'],
    silent: true,
  },
})
