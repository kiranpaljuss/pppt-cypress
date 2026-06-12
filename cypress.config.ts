import { defineConfig } from 'cypress';
import fs from 'node:fs';
import path from 'node:path';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';

function readEnvFile (fileName: string) {
  const envPath = path.resolve(process.cwd(), fileName);

  if (!fs.existsSync(envPath)) {
    return {};
  }

  return fs.readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .reduce<Record<string, string>>((acc, line) => {
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

export default defineConfig({
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
    experimentalMemoryManagement: true,
  },
});