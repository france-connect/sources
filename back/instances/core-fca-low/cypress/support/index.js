/**
 * Custom Cypress commands
 *
 * @see https://on.cypress.io/custom-commands
 */
import {
  clearBusinessLog,
  clearLog,
  deleteCookie,
  e2e,
  hasBusinessLog,
  hasError,
  hasLog,
  inConsole,
  proxyURLWasActivated,
  registerProxyURL,
  resetdb,
} from './commands';

Cypress.Commands.add('hasError', hasError);
Cypress.Commands.add('clearBusinessLog', clearBusinessLog);
Cypress.Commands.add('clearLog', clearLog);
Cypress.Commands.add('hasBusinessLog', hasBusinessLog);
Cypress.Commands.add('hasLog', hasLog);
Cypress.Commands.add('inConsole', inConsole);
Cypress.Commands.add('e2e', e2e);
Cypress.Commands.add('resetdb', resetdb);

Cypress.Commands.overwrite('clearCookie', deleteCookie);

Cypress.Commands.add('registerProxyURL', registerProxyURL);
Cypress.Commands.add('proxyURLWasActivated', proxyURLWasActivated);
