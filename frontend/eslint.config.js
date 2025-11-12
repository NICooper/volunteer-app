// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    plugins: { ts: require('@typescript-eslint/eslint-plugin') },
    rules: {
      "sort-imports": "on",
    }
  },
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);
