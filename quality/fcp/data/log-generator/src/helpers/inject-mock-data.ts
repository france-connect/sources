import { promises as fs } from 'fs';
import { resolve } from 'path';

import { AppConfig } from '../config';
import { HelpTracerFalseLogs } from '../enums';
import { LogsInterface } from '../interfaces';
import { debug } from './log';
import { safelyParseJson } from './safely-parse-json';

export async function injectMockData(
  file: string,
  service?: string,
): Promise<LogsInterface[]> {
  debug('Get mockData fullpaths');
  const paths = resolve(AppConfig.injectionBaseDir, file);

  const raw = await fs.readFile(paths, 'utf-8');

  debug('Parse logs from source');
  const logs: LogsInterface[] = raw
    .split('\n')
    .filter(Boolean)
    .map((log) => safelyParseJson(log))
    .map((event: LogsInterface) => ({
      ...event,
      '@version': HelpTracerFalseLogs.TRACE_MARK,
      service,
    }));

  return logs;
}
