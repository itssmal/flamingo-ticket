import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginImport from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ),
  {
    languageOptions: {
      parser: tsParser,
      globals: {
        React: 'readonly',
      },
    },
    plugins: {
      prettier,
      '@typescript-eslint': typescriptEslint,
      import: eslintPluginImport,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-useless-return': 'warn',
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: ['external', 'builtin', 'parent', ['sibling', 'index']],
          'newlines-between': 'always',
          pathGroups: [
            {
              group: 'external',
              pattern: '@/lib/**',
              position: 'after',
            },
            {
              group: 'external',
              pattern: '@/components/**',
              position: 'after',
            },
            {
              group: 'external',
              pattern: '../**',
              position: 'after',
            },
            {
              group: 'external',
              pattern: './**',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
    },
  },
];

export default eslintConfig;
