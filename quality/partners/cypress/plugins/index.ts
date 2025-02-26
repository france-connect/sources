import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addMatchImageSnapshotPlugin } from '@simonsmith/cypress-image-snapshot/plugin';
import onProxy from 'cypress-on-fix';

import { log, table } from './console-log-plugin';
import { createHexaHash } from './crypto-plugin';
import { getFixturePath } from './fixture-plugin';
import { mongoDeleteOne, mongoFindOne } from './mongo-plugin';
import { pgFindVersions } from './postgres-plugin';
import { rmqGetMessage, rmqSendMessage } from './rmq-plugin';

const pluginConfig = async (
  cypressOn: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): Promise<Cypress.PluginConfigOptions> => {
  // Workaround to allow multiple events registration for "after:screenshot"
  const on = onProxy(cypressOn);
  await addCucumberPreprocessorPlugin(on, config);
  addMatchImageSnapshotPlugin(on);

  on('task', {
    createHexaHash,
    getFixturePath,
    log,
    mongoDeleteOne,
    mongoFindOne,
    pgFindVersions,
    rmqGetMessage,
    rmqSendMessage,
    table,
  });

  on(
    'file:preprocessor',
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    }),
  );

  on(
    'before:browser:launch',
    (
      browser: Cypress.Browser,
      launchOptions: Cypress.BeforeBrowserLaunchOptions,
    ) => {
      // Options for visual tests
      // Use larger headless screen size to support all viewports
      if (browser.isHeadless && browser.name === 'electron') {
        launchOptions.preferences.width = 1440;
        launchOptions.preferences.height = 1200;
        launchOptions.preferences.webPreferences = {
          spellcheck: false,
        };
      }
      return launchOptions;
    },
  );

  // Retrieve CI context in Cypress
  config.env.CI = process.env.CI;

  return config;
};

export default pluginConfig;
