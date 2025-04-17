/* istanbul ignore file */

// Declarative code
const projectDir = `${process.env.FC_ROOT}/fc`;
const defaultLogGeneratorDir = `${projectDir}/quality/fcp/data/log-generator`;
const defaultInjectionBaseDir = `${projectDir}/docker/volumes/log`;
const logGeneratorDir = process.env.LOG_GENERATOR_DIR || defaultLogGeneratorDir;
const logVolumesDir = process.env.LOG_VOLUMES_DIR || defaultInjectionBaseDir;

export const AppConfig = {
  fixturesBaseDir: `${logGeneratorDir}/fixtures`,
  injectionBaseDir: logVolumesDir,
};
