const LOG_FILE_PATH = Cypress.env('LOG_FILE_PATH');

export function clearBusinessLog() {
  // -- DEBUG
  const command = `echo "" > '${LOG_FILE_PATH}'`;

  console.log(
    `
    Executing command:
    > ${command}
    `,
  );

  return cy.exec(command).its('code').should('eq', 0);
}
