/** @type {import("eslint").Linter.Config} */
const config = {
  env: {
    browser: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint', 'react', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'next',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier'
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        arrowParens: 'always',
        singleQuote: true,
        semi: true,
        tabWidth: 2,
        trailingComma: 'none'
      }
    ],
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports'
      }
    ],
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: {
          attributes: false
        }
      }
    ],
    'react/react-in-jsx-scope': 'off',
    '@next/next/no-img-element': 'off',
    '@next/next/no-sync-scripts': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      typescript: {
        project: './tsconfig.json'
      } // this loads <rootdir>/tsconfig.json to eslint
    }
  },
  ignorePatterns: ['node_modules/*', 'next.config.js']
};
module.exports = config;
