/// <reference types="cypress" />

import * as browserify from '@cypress/browserify-preprocessor';
import cucumber from 'cypress-cucumber-preprocessor';
import { addMatchImageSnapshotPlugin } from 'cypress-image-snapshot/plugin';
import * as processFixtureTemplate from 'cypress-template-fixtures';
import * as resolve from 'resolve';

import { getFixturePath } from './fixture-plugin';

const pluginConfig = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): Cypress.PluginConfigOptions => {
  processFixtureTemplate(on, config);
  addMatchImageSnapshotPlugin(on, config);

  const options = {
    ...browserify.defaultOptions,
    typescript: resolve.sync('typescript', { baseDir: config.projectRoot }),
  };

  on('task', {
    getFixturePath,
  });

  on('file:preprocessor', cucumber(options));

  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.name === 'electron' && browser.isHeadless) {
      // Use larger headless screen size to support all viewports
      launchOptions.preferences.width = 1440;
      launchOptions.preferences.height = 1200;
    }
    return launchOptions;
  });

  return config;
};

export default pluginConfig;
