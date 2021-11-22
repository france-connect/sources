const SAFETY_EXEC_TIMEOUT = 10000; // 10 sec

const DOCKER_DIR = 'cd $FC_ROOT/fc/docker';

export function resetMongoFC() {
  const command = `${DOCKER_DIR} && CI=1 ./docker-stack reset-db-core-fcp-high`;

  console.log(`
    Executing command:
    > ${command}
  `);

  return cy
    .exec(command, { timeout: SAFETY_EXEC_TIMEOUT })
    .its('code')
    .should('eq', 0);
}
