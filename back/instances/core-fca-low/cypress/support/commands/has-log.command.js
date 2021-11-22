// Path to script
const EXEC_TOOL_PATH = './cypress/support/scripts/readLog.js';
const LOG_FILE_PATH = '../../../docker/volumes/log/';
const LOG_FILE_EXT = '.log';

export function hasLog(app, input) {
  const stringifiedEvent = window.btoa(input);
  const file = `${LOG_FILE_PATH}${app}${LOG_FILE_EXT}`;
  const command = `node ${EXEC_TOOL_PATH} '${file}' '${stringifiedEvent}'`;

  console.log(
    `
    Executing command:
    > ${command}
    `,
  );
  return cy.exec(command).its('code').should('eq', 0);
}
