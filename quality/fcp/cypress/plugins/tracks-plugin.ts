import * as path from 'path';

import { exec } from 'child_process';
import { DateTime } from 'luxon';
import { promisify } from 'util';

const asyncExec = promisify(exec);

interface addTracksArgs {
  tracksType: string;
}

function getCallerFrom(app: string, directory: string, script: string) {
  const dockerStack = '$FC_ROOT/fc-docker/docker-stack';
  const launcher = path.join(directory, script);

  return async (params = '') => {
    const command = `export CI=1; ${dockerStack} exec ${app} node --trace-warnings ${launcher} ${params}`;

    // eslint-disable-next-line no-console
    console.log(`Call: ${command}`);
    try {
      const { stderr, stdout } = await asyncExec(command);

      if (stderr) {
        // eslint-disable-next-line no-console
        console.log(`stderr: ${stderr}`);
      }
      // eslint-disable-next-line no-console
      console.log(`stdout: ${stdout}`);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw new Error(`Failed to call script: ${script}`);
    }
  };
}

const tracksScript = getCallerFrom(
  'csmr-tracks-high', // /!\ must contains ES access
  './apps/csmr-tracks/fixtures/scripts',
  'populate-account-traces.script.js',
);

const legacyScript = getCallerFrom(
  'fc-core',
  './projects/fc/core',
  'cli.js traces',
);

/**
 * Add tracks in elasticSearch in csmr-tracks
 */
export async function addTracks(args: addTracksArgs): Promise<void> {
  const { tracksType } = args;

  // eslint-disable-next-line no-console
  console.log(`Add tracks '${tracksType}'`);
  await tracksScript();

  // eslint-disable-next-line no-console
  console.log(`Tracks injection done`);
  return null;
}

export async function addTracksLegacy(args: addTracksArgs): Promise<void> {
  const { tracksType } = args;
  const accountId = 'test_TRACE_USER';

  // Setup dates
  const now = DateTime.now().toUTC();
  const justBeforeNow = now.minus({ day: 1 });
  const justBefore = now.minus({ month: 6 }).plus({ day: 1 });
  const justAfter = now.minus({ month: 6 }).minus({ day: 1 });
  const dates = [justBeforeNow, justBefore, justAfter].map((date) =>
    date.toISODate(),
  );

  // eslint-disable-next-line no-console
  console.log(`Clean tracks from database`);
  await legacyScript('remove');

  // eslint-disable-next-line no-console
  console.log(`Add tracks '${tracksType}'`);
  await legacyScript(`generate ${accountId} '${JSON.stringify(dates)}'`);

  // eslint-disable-next-line no-console
  console.log(`Tracks injection done`);
  return null;
}
