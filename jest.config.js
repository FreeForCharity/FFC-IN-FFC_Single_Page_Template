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
  // Coverage floors set a few points below the current measured coverage
  // (branches ~51%, functions ~65%, lines/statements ~65%) so a real
  // regression fails CI, while leaving enough margin that a trivial diff
  // adding one uncovered branch doesn't. Raise these as coverage improves.
  coverageThreshold: {
    global: {
      branches: 45,
      functions: 58,
      lines: 58,
      statements: 58,
    },
  },
  moduleNameMapper: {
    // Handle module aliases (from tsconfig.json)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
