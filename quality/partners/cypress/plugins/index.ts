/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
import * as browserify from '@cypress/browserify-preprocessor';
import cucumber from 'cypress-cucumber-preprocessor';
import { addMatchImageSnapshotPlugin } from 'cypress-image-snapshot/plugin';
import * as processFixtureTemplate from 'cypress-template-fixtures';
import * as resolve from 'resolve';

import { getFixturePath } from './fixture-plugin';

module.exports = (on, config: Cypress.PluginConfigOptions) => {
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
