/**
 * Custom Cypress commands
 *
 * @see https://on.cypress.io/custom-commands
 */
import {
  e2e,
  hasBusinessLog,
  hasError,
  resetdb,
  registerProxyURL,
  proxyURLWasActivated,
  clearBusinessLog,
} from './commands';
import 'cypress-plugin-tab';

Cypress.Commands.add('hasError', hasError);
Cypress.Commands.add('hasBusinessLog', hasBusinessLog);
Cypress.Commands.add('clearBusinessLog', clearBusinessLog);
Cypress.Commands.add('e2e', e2e);
Cypress.Commands.add('resetdb', resetdb);
Cypress.Commands.add('registerProxyURL', registerProxyURL);
Cypress.Commands.add('proxyURLWasActivated', proxyURLWasActivated);
