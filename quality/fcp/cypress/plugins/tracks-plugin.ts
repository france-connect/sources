import { DateTime, Interval } from 'luxon';

import { getCallerFrom } from './helpers';

interface IAddTracksArgs {
  tracksType: string;
}

interface IAddTracksParams {
  datesParam: string;
  filesParam: string;
}

// end date will not be included
function getDaysAsIso(start: DateTime, end: DateTime): string[] {
  const interval = Interval.fromDateTimes(start, end);
  const steps = interval.splitBy({ days: 1 });
  const dates = steps.map(({ start: s }) => s.toISO());
  return dates;
}

function getParamsByTracksType(
  tracksType: string,
  defaultMockDataFiles: string[],
): IAddTracksParams {
  let mockDataFiles = defaultMockDataFiles;
  let dates = [];
  const result = tracksType.match(/^(\d+) connexions?$/);
  if (result) {
    mockDataFiles = [defaultMockDataFiles[0]];
    const [, strCount] = result;
    const count = Number.parseInt(strCount, 10);

    const now = DateTime.now().setZone('Europe/Paris');
    const old = now.minus({ days: count });
    dates = getDaysAsIso(old, now);
  }
  const datesParam = dates.length ? `'${JSON.stringify(dates)}'` : '';
  const filesParam = `'${JSON.stringify(mockDataFiles)}'`;
  const params: IAddTracksParams = {
    datesParam,
    filesParam,
  };
  return params;
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
    `$FC_ROOT/fc/docker/docker-stack exec fc-core node --trace-warnings ./cypress/support/script/traces.js`,
  );

  async function addTracks(args: IAddTracksArgs): Promise<void> {
    const { tracksType } = args;
    const accountId = 'test_TRACE_USER';
    const DEFAULT_MOCKDATA_FILES = [
      '/tracks/fsp1-high/public_fip1-high.mock.ejs',
      '/tracks/fsp5-high/private_fip1-high.mock.ejs',
      '/tracks/missing/missing_fip1-high.mock.ejs',
    ];

    // eslint-disable-next-line no-console
    console.log(`Add tracks 'FranceConnect+' for '${tracksType}'`);
    const { datesParam, filesParam } = getParamsByTracksType(
      tracksType,
      DEFAULT_MOCKDATA_FILES,
    );
    await tracksScript(`generate ${accountId} ${filesParam} ${datesParam}`);

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

  async function addTracksLegacy(args: IAddTracksArgs): Promise<void> {
    const { tracksType } = args;
    const accountId = 'test_TRACE_USER';
    const DEFAULT_MOCKDATA_FILES = [
      'fixtures/fsp1-fip1.mock.ejs',
      'fixtures/fsp3-fip1.mock.ejs',
    ];

    // eslint-disable-next-line no-console
    console.log(`Add tracks 'FranceConnect' for '${tracksType}'`);
    const { datesParam, filesParam } = getParamsByTracksType(
      tracksType,
      DEFAULT_MOCKDATA_FILES,
    );
    await legacyScript(`generate ${accountId} ${filesParam} ${datesParam}`);

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
