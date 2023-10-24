/**
 * Log Retrieval helper.
 *
 * This tool retrieve a log entry and compare it to provided test object.
 *
 * If an entry is found and has at least the same properties than the provided test object,
 * execution ends with a success message and a "0" exit code.
 *
 * If no entry is found, execution ends with and error message and a "3" exit code
 *
 * If an entry is found but does not have all properties from provided test object,
 * execution ends with an error message and a "4" exit code.
 *
 * Usage:
 *
 * > ts-node get-business-logs.ts '/path/to/file.log' '{"JSON": "string", "test": "object"}'
 */

import { promises as fs } from 'fs';

type LogEvent = {
  event: string;
  [key: string]: string;
};

const loadLog = async (path: string): Promise<LogEvent[]> => {
  const rawData = await fs.readFile(path, 'utf8');
  return rawData
    .split('\n')
    .filter(Boolean)
    .map((row) => JSON.parse(row))
    .reverse();
}

const getBusinessLogs = async ([logFile, stringifiedTestEvent]: string[]): Promise<void> => {
  try {
    const logs: LogEvent[] = await loadLog(logFile);
    const testEvent: LogEvent = JSON.parse(stringifiedTestEvent);

    const foundEvents: LogEvent[] = logs.filter((log) => log.event === testEvent.event);

    // eslint-disable-next-line no-console
    console.log(JSON.stringify(foundEvents));
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
}

getBusinessLogs(process.argv.slice(2));
