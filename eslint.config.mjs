import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import pluginImport from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier'; // This disables formatting rules

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
      import: pluginImport,
    },
    rules: {
      // Sorting imports
      'import/order': ['warn', { groups: [['builtin', 'external', 'internal']] }],

      // Show warnings for unused variables
      '@typescript-eslint/no-unused-vars': 'warn',

      // Warn for console.log but allow warn/error/info
      // 'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

      // Require semicolons
      'semi': ['error', 'always'],
    },
  },
  // ✅ Prettier config disabling conflicting ESLint rules
  prettierConfig,
];
