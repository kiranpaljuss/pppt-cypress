const pluginCypress = require('eslint-plugin-cypress');
const eslintPluginJsonc = require('eslint-plugin-jsonc');
const tsParser = require('@typescript-eslint/parser');
const jsoncParser = require('jsonc-eslint-parser');
const js = require('@eslint/js');
const globals = require('globals');

const cypressRecommended = pluginCypress.configs.recommended;

const cypressRules = {
  ...cypressRecommended.rules,
  'cypress/no-unnecessary-waiting': 'off',
  'cypress/unsafe-to-chain-command': 'off',
};

const jsoncRules = {
  ...eslintPluginJsonc.configs['recommended-with-json'].rules,
  'jsonc/array-bracket-newline': ['error', 'consistent'],
  'jsonc/object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
  'jsonc/object-curly-newline': ['error', { multiline: true, minProperties: 1 }],
  'jsonc/array-bracket-spacing': ['error', 'never'],
  'jsonc/array-element-newline': ['error', 'consistent'],
  'jsonc/object-curly-spacing': ['error', 'always'],
  'jsonc/indent': ['error', 2],
  'jsonc/no-comments': ['error'],
};

const generalRules = {
  ...js.configs.recommended.rules,
  complexity: 'off',
  'max-len': 'off',
  'max-params': ['error', 4],
  'max-statements': 'off',
  'max-depth': 'off',
  'max-nested-callbacks': 'off',
  indent: ['error', 2],
  'linebreak-style': ['error', 'unix'],
  'space-before-function-paren': ['error', 'always'],
  curly: ['error', 'all'],
  'brace-style': ['error', '1tbs'],
  quotes: ['warn', 'single', { avoidEscape: true }],
  eqeqeq: ['error', 'allow-null'],
  semi: ['error', 'always'],
  'new-cap': 'off',
  'no-console': 'off',
  'no-empty': 'off',
  'no-unused-vars': 'warn',
  'space-before-blocks': ['error', 'always'],
  'keyword-spacing': ['error', { before: true, after: true }],
  'no-trailing-spaces': ['error', { skipBlankLines: false }],
  'eol-last': 'off',
};

module.exports = [
  {
    ignores: ['report/**'],
  },
  {
    plugins: cypressRecommended.plugins,
    languageOptions: {
      globals: {
        ...cypressRecommended.languageOptions.globals,
      },
    },
    rules: cypressRules,
  },
  {
    files: ['**/*.json', '**/*.jsonc', '**/*.json5'],
    languageOptions: { parser: jsoncParser },
    plugins: { jsonc: eslintPluginJsonc },
    rules: jsoncRules,
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...cypressRecommended.languageOptions.globals,
      },
    },
    rules: generalRules,
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: generalRules,
  },
];