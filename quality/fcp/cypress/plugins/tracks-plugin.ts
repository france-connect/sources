import { exec } from 'child_process';
import { DateTime, Interval } from 'luxon';
import { promisify } from 'util';

const asyncExec = promisify(exec);

interface TracksArgsInterface {
  mockSet: string;
}
interface AddTracksArgsInterface extends TracksArgsInterface {
  tracksType: string;
}

interface AddTracksParamsInterface {
  datesParam: string;
  filesParam: string;
}

// Data
const DEFAULT_ACCOUNT_ID = 'test_TRACE_USER';
const DEFAULT_MOCK_FILES = {
  high: [
    'fcp-high/public_fsp1-high_fip1-high.mock.ejs',
    'fcp-high/private_fsp5-high_fip1-high.mock.ejs',
    'fcp-high/no-display_fsp1-high_fip1-high.mock.ejs',
  ],
  legacy: [
    'fcp-legacy/public_fsp1_fip1.mock.ejs',
    'fcp-legacy/private_fsp3_fip1.mock.ejs',
    'fcp-legacy/no-display_fsp1_fip1.mock.ejs',
  ],
  low: [
    'fcp-low/public_fsp1-low_fip1.mock.ejs',
    'fcp-low/private_fsp5-low_fip1.mock.ejs',
    'fcp-low/no-display_fsp1-low_fip1.mock.ejs',
  ],
};

// end date will not be included
const getDaysAsIso = (start: DateTime, end: DateTime): string[] => {
  const interval = Interval.fromDateTimes(start, end);
  const steps = interval.splitBy({ days: 1 });
  const dates = steps.map(({ start: s }) => s.toISO());
  return dates;
};

const getParamsByTracksType = (
  tracksType: string,
  defaultMockDataFiles: string[],
): AddTracksParamsInterface => {
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
  const params: AddTracksParamsInterface = {
    datesParam,
    filesParam,
  };
  return params;
};

const executeTracksCmd = async (
  cmd: string,
  ctx: string[] = [],
): Promise<void> => {
  const BASE_TRACKS_COMMAND = 'cd $FC_ROOT/fc/quality/fcp && yarn traces';
  const command = `${[...ctx, 'export CI=1'].join(' ')}; ${BASE_TRACKS_COMMAND} ${cmd}`;
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
    throw new Error(`Failed to call script ${cmd}`);
  }
  return null;
};

export const addTracks = async (
  args: AddTracksArgsInterface,
): Promise<void> => {
  const { mockSet = 'high', tracksType } = args;
  const accountId = DEFAULT_ACCOUNT_ID;
  const mocks = DEFAULT_MOCK_FILES[mockSet];

  // eslint-disable-next-line no-console
  console.log(`Add tracks '${mockSet}' for '${tracksType}'`);
  const { datesParam, filesParam } = getParamsByTracksType(tracksType, mocks);
  await executeTracksCmd(
    `generate ${mockSet} ${accountId} ${filesParam} ${datesParam}`,
  );

  // eslint-disable-next-line no-console
  console.log(`Tracks generation and injection done`);
  return null;
};

export const injectTracks = async (
  args: TracksArgsInterface,
): Promise<void> => {
  const { mockSet } = args;
  const accountId = DEFAULT_ACCOUNT_ID;
  const logFiles = {
    high: 'core-fcp-high.log',
    legacy: 'event.log',
    low: 'core-fcp-low.log',
  };

  // eslint-disable-next-line no-console
  console.log(`Clean tracks ${mockSet} from database`);
  await executeTracksCmd(`remove ${mockSet}`);

  // eslint-disable-next-line no-console
  console.log(`Inject tracks ${mockSet}`);
  await executeTracksCmd(`inject ${mockSet} ${accountId} ${logFiles[mockSet]}`);

  // eslint-disable-next-line no-console
  console.log(`Tracks injection done`);
  return null;
};

export const removeAllTracks = async (): Promise<void> => {
  await removeTracks({ mockSet: 'high' });
  await removeTracks({ mockSet: 'legacy' });
  await removeTracks({ mockSet: 'low' });
  return null;
};

export const removeTracks = async (
  args: TracksArgsInterface,
): Promise<void> => {
  const { mockSet } = args;
  // eslint-disable-next-line no-console
  console.log(`Remove tracks ${mockSet}`);
  await executeTracksCmd(`remove ${mockSet}`);

  // eslint-disable-next-line no-console
  console.log(`Tracks removed`);
  return null;
};
