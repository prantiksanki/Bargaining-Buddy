import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] }, // Ignore build output directory to avoid unnecessary linting
  {
    files: ['**/*.{js,jsx}'], // Target JavaScript and JSX files
    languageOptions: {
      ecmaVersion: 2020, // Support modern JavaScript syntax
      globals: globals.browser, // Enable browser globals like window, document
      parserOptions: {
        ecmaVersion: 'latest', // Use latest ECMAScript version
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
        sourceType: 'module', // Support ES modules
      },
    },
    plugins: {
      'react-hooks': reactHooks, // Enforce React Hooks best practices
      'react-refresh': reactRefresh, // Support for fast refresh in development
    },
    rules: {
      ...js.configs.recommended.rules, // Base ESLint recommended rules
      ...reactHooks.configs.recommended.rules, // Recommended rules for React hooks
      // Allow unused vars if they are constants (typically UPPERCASE or _prefixed)
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Warn if non-component values are exported, to support React Fast Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
