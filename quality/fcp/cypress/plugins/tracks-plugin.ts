import { DateTime } from 'luxon';

import { getCallerFrom } from './helpers';

interface addTracksArgs {
  tracksType: string;
}

export function tracksBuilder(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): void {
  const { env } = config;

  const elasticSearch = Object.entries(env)
    .filter(([conf]) => conf.startsWith('Elasticsearch'))
    .map(([key, value]) => [key, JSON.stringify(value)].join('='))
    .map((props) => `export ${props}`);

  const tracksScript = getCallerFrom(
    'node --trace-warnings ./data/userdashboard/populate-account-traces.script.js',
    elasticSearch,
  );

  const legacyScript = getCallerFrom(
    `$FC_ROOT/fc-docker/docker-stack exec fc-core node --trace-warnings ./projects/fc/core/cli.js traces`,
  );

  async function addTracks(args: addTracksArgs): Promise<void> {
    const { tracksType } = args;
    const accountId = 'test_TRACE_USER';

    // eslint-disable-next-line no-console
    console.log(`Add tracks 'FranceConnect+' for '${tracksType}'`);
    await tracksScript(`generate ${accountId}`);

    // eslint-disable-next-line no-console
    console.log(`Tracks injection done`);
    return null;
  }

  async function removeTracks(): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`Remove tracks 'FranceConnect+'`);
    await tracksScript('remove');

    // eslint-disable-next-line no-console
    console.log(`Tracks removed`);
    return null;
  }

  async function addTracksLegacy(args: addTracksArgs): Promise<void> {
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
    console.log(`Add tracks 'FranceConnect' for '${tracksType}'`);
    await legacyScript(`generate ${accountId} '${JSON.stringify(dates)}'`);

    // eslint-disable-next-line no-console
    console.log(`Tracks injection done`);
    return null;
  }

  async function injectTracksLegacy(): Promise<void> {
    const accountId = 'test_TRACE_USER';
    const logPath = '/var/log/fc-evt/event.log';

    // eslint-disable-next-line no-console
    console.log(`Clean tracks from database`);
    await legacyScript('remove');

    // eslint-disable-next-line no-console
    console.log(`Inject tracks 'FranceConnect'`);
    await legacyScript(`inject ${accountId} ${logPath}`);

    // eslint-disable-next-line no-console
    console.log(`Tracks injection done`);
    return null;
  }

  async function removeTracksLegacy(): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`Remove tracks 'FranceConnect'`);
    await legacyScript('remove');

    // eslint-disable-next-line no-console
    console.log(`Tracks removed`);
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  on('task', {
    addTracks,
    addTracksLegacy,
    injectTracksLegacy,
    removeTracks,
    removeTracksLegacy,
  });
}
