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
import * as processFixtureTemplate from 'cypress-template-fixtures';
import * as resolve from 'resolve';

import { getFixturePath } from './fixture-plugin';
import { clearBusinessLog, hasBusinessLog } from './log-plugin';
import { addTracks } from './tracks-plugin';

module.exports = (on, config) => {
  processFixtureTemplate(on, config);

  const options = {
    ...browserify.defaultOptions,
    typescript: resolve.sync('typescript', { baseDir: config.projectRoot }),
  };

  on('task', {
    addTracks,
    clearBusinessLog,
    getFixturePath,
    hasBusinessLog,
  });

  on('file:preprocessor', cucumber(options));

  const { env: { TEST_ENV: testEnv = '', BASE_URLS: baseUrls = {} } = {} } =
    config;
  // Override the baseUrl if present in the config
  if (baseUrls[testEnv]) {
    config.baseUrl = baseUrls[testEnv];
  }
  if (testEnv === 'integ01') {
    /**
     * On integ01 environment, the FC core, FS and FI are using different domains
     * @link: https://docs.cypress.io/guides/guides/web-security#Same-superdomain-per-test
     * In order to run the tests,
     * - we need to disable the chrome web security to allow redirections to different domains
     * @link: https://docs.cypress.io/guides/guides/web-security#Disabling-Web-Security
     * - we need to use Cookies with samesite=none (intercept in beforeEach hook)
     */
    config.chromeWebSecurity = false;
  }

  return config;
};
