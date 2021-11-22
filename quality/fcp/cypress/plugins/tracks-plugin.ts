import { exec } from 'child_process';
import { promisify } from 'util';

const asyncExec = promisify(exec);
const DOCKER_STACK = '$FC_ROOT/fc-docker/docker-stack';
const CSMR_TRACKS_APP = 'csmr-tracks';

interface addTracksArgs {
  tracksType: string;
}

/**
 * Add tracks in elasticSearch in csmr-tracks
 */
export async function addTracks(args: addTracksArgs): Promise<void> {
  const { tracksType } = args;
  const scriptPath = './apps/csmr-tracks/fixtures/scripts';
  const script = 'populate-account-traces.script.js';

  // eslint-disable-next-line no-console
  console.log(`Add tracks '${tracksType}' using ${script}`);
  const command = `${DOCKER_STACK} exec ${CSMR_TRACKS_APP} node --trace-warnings ${scriptPath}/${script}`;
  const { stderr, stdout } = await asyncExec(command);

  if (stderr) {
    // eslint-disable-next-line no-console
    console.log(`stderr: ${stderr}`);
  }
  // eslint-disable-next-line no-console
  console.log(`stdout: ${stdout}`);
  return null;
}
