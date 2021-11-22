/**
 * log data in console
 * @param {Object} data data to log in native console
 */
export function inConsole(...data) {
  Cypress.log({
    name: this.name,
    displayName: 'FC:Console',
    message: JSON.stringify(data),
  }).snapshot();

  cy.task('logInConsole', data, { log: false });
}
