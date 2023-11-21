/**
 * Custom Cypress commands
 *
 * @see https://on.cypress.io/custom-commands
 */
import {
  e2e,
  clearBusinessLog,
  hasBusinessLog,
  hasError,
  hasErrorMessage,
  resetdb,
  registerProxyURL,
  proxyURLWasActivated,
  login,
  logout,
  formFill,
  getTechnicalLogs,
  resetTechnicalLog,
  verifyEmailIsSent,
} from './commands';
import 'cypress-plugin-tab';

Cypress.Commands.add('hasError', hasError);
Cypress.Commands.add('hasErrorMessage', hasErrorMessage);
Cypress.Commands.add('hasBusinessLog', hasBusinessLog);
Cypress.Commands.add('clearBusinessLog', clearBusinessLog);
Cypress.Commands.add('e2e', e2e);
Cypress.Commands.add('resetdb', resetdb);
Cypress.Commands.add('registerProxyURL', registerProxyURL);
Cypress.Commands.add('proxyURLWasActivated', proxyURLWasActivated);
Cypress.Commands.add('login', login);
Cypress.Commands.add('logout', logout);
Cypress.Commands.add('formFill', formFill);
Cypress.Commands.add('getTechnicalLogs', getTechnicalLogs);
Cypress.Commands.add('verifyEmailIsSent', verifyEmailIsSent);
Cypress.Commands.add('resetTechnicalLog', resetTechnicalLog);
