/// <reference types="cypress" />

import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addMatchImageSnapshotPlugin } from 'cypress-image-snapshot/plugin';

import { log, table } from './console-log-plugin';
import { createHexaHash } from './crypto-plugin';
import { getFixturePath } from './fixture-plugin';
import { getJwtContent, isJwsValid } from './jwt-plugin';
import {
  clearBusinessLog,
  getAllBusinessLogs,
  getBusinessLogs,
  hasBusinessLog,
} from './log-plugin';
import { getTotp } from './otp-plugin';
import { tracksBuilder } from './tracks-plugin';

const pluginConfig = async (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
  isVisualTestConfig: boolean,
): Promise<Cypress.PluginConfigOptions> => {
  await addCucumberPreprocessorPlugin(on, config);

  on('task', {
    clearBusinessLog,
    createHexaHash,
    getAllBusinessLogs,
    getBusinessLogs,
    getFixturePath,
    getJwtContent,
    getTotp,
    hasBusinessLog,
    isJwsValid,
    log,
    table,
  });

  tracksBuilder(on, config);

  on(
    'file:preprocessor',
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    }),
  );

  if (isVisualTestConfig) {
    addMatchImageSnapshotPlugin(on, config);

    on('before:browser:launch', (_browser, launchOptions) => {
      // Use larger headless screen size to support all viewports
      launchOptions.preferences.width = 1440;
      launchOptions.preferences.height = 1200;
      launchOptions.preferences.webPreferences = {
        spellcheck: false,
      };
      return launchOptions;
    });
  }

  return config;
};

export default pluginConfig;
