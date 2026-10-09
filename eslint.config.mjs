import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import nextPlugin from 'eslint-config-next'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  // eslint-config-next@16.0.7 exports a flat config array natively for ESLint 9+.
  // Import directly to avoid FlatCompat circular structure errors with react-hooks@7.0.1.
  ...nextPlugin,
  // Prettier config can still use FlatCompat without issues
  ...compat.extends('plugin:prettier/recommended'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'test-results/**',
      'playwright-report/**',
    ],
  },
  {
    files: ['jest.config.js', 'jest.setup.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]

export default eslintConfig
