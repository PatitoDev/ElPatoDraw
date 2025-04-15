import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import pluginRefresh from 'eslint-plugin-react-refresh';
import pluginPromise from 'eslint-plugin-promise';


export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  reactHooks.configs['recommended-latest'],
  pluginPromise.configs['flat/recommended'],
  pluginRefresh.configs.vite,
  {
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      'indent': ['error', 2],
      'quotes': ['error', 'single' ],
      'jsx-quotes': ['error', 'prefer-single' ],
      'semi': ['error', 'always' ],
    }
  }
]);