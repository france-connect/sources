import { resolve } from 'path';

import { renderFile } from 'ejs';
import { DateTime } from 'luxon';

import { AppConfig } from '../config';
import { HelpTracerFalseLogs } from '../enums';
import { LogsInterface } from '../interfaces';
import { debug } from './log';
import { safelyParseJson } from './safely-parse-json';

export async function generateMockData(
  id: string,
  mockDataPaths: string[],
  dates: DateTime[],
): Promise<LogsInterface[]> {
  debug('Get mockData fullpaths');
  const paths = mockDataPaths.map((file) =>
    resolve(AppConfig.fixturesBaseDir, file),
  );

  debug(`Prepare mock order for ${dates.join(',')}`);
  const orders = dates.map((date, index) => ({
    mock: paths[index % paths.length],
    time: date.toMillis(),
  }));

  debug(`Render ${orders.length} group of mocks`);
  const jobs = orders.map(({ mock, time }) =>
    renderFile(mock, { accountId: id, time }),
  );

  const data = await Promise.all(jobs);

  debug(`Join ${data.length} group of generated mocks`);
  const raw = data.join('\n');

  debug('Parse logs from source');
  const event = raw
    .split('\n')
    .filter(Boolean)
    .map((log) => safelyParseJson(log))
    .map((event: LogsInterface) => ({
      ...event,
      '@version': HelpTracerFalseLogs.TRACE_MARK,
    }));

  return event;
}
