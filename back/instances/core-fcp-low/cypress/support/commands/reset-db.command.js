const SAFETY_EXEC_TIMEOUT = 10000; // 10 sec

export function resetdb() {
  const command = `cd ${Cypress.env(
    'FC_DOCKER_PATH',
  )} && CI=1 ./docker-stack reset-db-core-fcp-low`;

  console.log(`
      Executing command:
      > ${command}
    `);

  return cy
    .exec(command, { timeout: SAFETY_EXEC_TIMEOUT })
    .its('code')
    .should('eq', 0);
}
