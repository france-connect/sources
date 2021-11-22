/**
 * Custom Cypress commands
 *
 * @see https://on.cypress.io/custom-commands
 */
import {
  hasBusinessLog,
  hasError,
  registerProxyURL,
  proxyURLWasActivated,
  clearBusinessLog,
} from './commands';

/**
 * Needed because the eidas node throws unhandled exceptions in the front javasript
 * and it stop the test with a "decodeCurrentAddress is not defined"
 */
Cypress.on('uncaught:exception', (err) => {
  // returning false here prevents Cypress from
  // failing the test
  console.error(err);
  return false;
});

Cypress.Commands.add('hasError', hasError);
Cypress.Commands.add('clearBusinessLog', clearBusinessLog);
Cypress.Commands.add('hasBusinessLog', hasBusinessLog);
Cypress.Commands.add('registerProxyURL', registerProxyURL);
Cypress.Commands.add('proxyURLWasActivated', proxyURLWasActivated);
