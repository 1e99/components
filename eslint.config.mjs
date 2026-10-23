import js from '@eslint/js';
import google from 'eslint-config-google';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '.husky/_/**',
      '.superpowers/**',
      'coverage/**',
      'dist/**',
      'node_modules/**',
      'storybook-static/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      sourceType: 'module',
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...google.rules,
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...reactHooks.configs['recommended-latest'].rules,
      'max-len': ['error', {
        code: 80,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
        tabWidth: 2,
      }],
      '@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
      'no-unused-vars': 'off',
      'react/prop-types': 'off',
      // Removed from ESLint core in v9; TypeScript owns the type contract.
      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',
    },
  },
];
