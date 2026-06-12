const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const addCucumberPreprocessorPlugin = require('@badeball/cypress-cucumber-preprocessor').addCucumberPreprocessorPlugin;
const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild').createEsbuildPlugin;

function readEnvFile (fileName) {
  const envPath = path.resolve(__dirname, fileName);

  if (!fs.existsSync(envPath)) {
    return {};
  }

  return fs.readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .reduce((acc, line) => {
      const firstEquals = line.indexOf('=');
      const key = line.slice(0, firstEquals).trim();
      const value = line.slice(firstEquals + 1).trim();

      if (key) {
        acc[key] = value;
      }

      return acc;
    }, {});
}

const templateEnvValues = readEnvFile('.env.template');
const dotEnvValues = readEnvFile('.env');

module.exports = defineConfig({
  chromeWebSecurity: false,
  watchForFileChanges: false,
  viewportHeight: 720,
  viewportWidth: 1280,
  defaultCommandTimeout: 10000,
  env: {
    ...templateEnvValues,
    ...dotEnvValues,
  },
  e2e: {
    async setupNodeEvents (on, config) {
      const bundler = createBundler({
        plugins: [createEsbuildPlugin(config)],
      });

      on('file:preprocessor', bundler);
      await addCucumberPreprocessorPlugin(on, config);

      return config;
    },
    specPattern: 'cypress/integration/features/**/*.feature',
    chromeWebSecurity: false,
    excludeSpecPattern: ['*.js', '*.md'],
    experimentalMemoryManagement: true
  },
});