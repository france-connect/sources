/* istanbul ignore file */

// Declarative code
const projectDir = `${process.env.FC_ROOT}/fc`;

export const AppConfig = {
  fixturesBaseDir: `${projectDir}/quality/fcp/data/log-generator/fixtures`,
  injectionBaseDir: `${projectDir}/docker/volumes/log`,
};
