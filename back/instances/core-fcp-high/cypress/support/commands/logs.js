
const STEP_NAME = 'FC:Logs';

/**
 * clear the logs file to help in E2E
 * @param {string} path defined path of logs file
 */
export function resetTechnicalLog(path) {
  const uri = path || Cypress.env('LOG_CONSOLE_FILE_PATH');

  Cypress.log({
    name: this.name,
    displayName: STEP_NAME,
    message: `Clear logs file at path: ${uri}`,
  }).snapshot();

  cy.task('clearLogsFile', uri, { log: false }).then((success) => {
    assert.isOk(success, 'the log file was not found');
  });
}

export function getTechnicalLogs(path) {
  Cypress.log({
    name: 'getTechnicalLogs',
    displayName: STEP_NAME,
    message: `Reading logs file`,
    consoleProps: () => ({
      path,
    }),
  }).snapshot();
  cy.task('getLogFile', path, { log: false }).as('data:log');
  return cy
    .get('@data:log', { log: false })
    .then((logs) => logs.split('\n').reverse().join('\n'));
}

export function verifyEmailIsSent(emailTitle) {
  cy
    .getTechnicalLogs(
      `${Cypress.env('LOG_CONSOLE_FILE_PATH')}`
    )
    .then((logs) => {
      const regex = new RegExp(emailTitle);
      const emailTitleFound = logs.match(regex);
      expect(emailTitleFound).not.to.equal(null);
    });
}
