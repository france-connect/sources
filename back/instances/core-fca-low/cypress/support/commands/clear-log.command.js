const LOG_FILE_PATH = '../../../docker/volumes/log/';
const LOG_FILE_EXT = '-0.log';

export function clearLog(app) {
  const path = `${LOG_FILE_PATH}${app}${LOG_FILE_EXT}`;
  const command = `echo "" > '${path}'`;

  console.log(
    `
    Executing command:
    > ${command}
    `,
  );

  return cy.exec(command).its('code').should('eq', 0);
}
