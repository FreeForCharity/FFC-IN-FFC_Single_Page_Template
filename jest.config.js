const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!**/node_modules/**',
    '!src/app/layout.tsx', // Exclude layout due to font imports causing issues
  ],
  // Floors leave margin below measured coverage: branches 74%, functions 81%,
  // lines 86%, statements 84%. CI runs coverage and fails on regressions.
  coverageThreshold: {
    global: {
      branches: 68,
      functions: 75,
      lines: 80,
      statements: 78,
    },
  },
  moduleNameMapper: {
    // Handle module aliases (from tsconfig.json)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
