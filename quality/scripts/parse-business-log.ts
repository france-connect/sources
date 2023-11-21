/**
 * Log inspection helper.
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
 * > ts-node parse-business-log.ts '/path/to/file.log' '{"JSON": "string", "test": "object"}'
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
};

const interactionHasEvent = async ([
  logFile,
  stringifiedTestEvent,
]: string[]): Promise<void> => {
  try {
    const logs: LogEvent[] = await loadLog(logFile);
    const testEvent: LogEvent = JSON.parse(stringifiedTestEvent);

    /**
     * First check only on basic keys.
     *
     * This allows us to retrieve a failling log,
     * rather than having no match at all,
     * usefull for debuging purpose.
     */
    const foundEvent: LogEvent = logs.find(
      (log) => log.event === testEvent.event,
    );

    if (!foundEvent) {
      // eslint-disable-next-line no-console
      console.error('Event not found');
      process.exit(3);
    }

    /**
     * Now check every given properties.
     *
     * We do not require test to provide all properties,
     * some of which may be hard or to guess or not relevant in a test.
     */
    const differences = getDifferences(testEvent, foundEvent);

    if (differences.length > 0) {
      // eslint-disable-next-line no-console
      console.error(
        `
        Event mismatch
        Diff: ${JSON.stringify(differences)}
        Found event: ${JSON.stringify(foundEvent)}
        Test event: ${JSON.stringify(testEvent)}
        `,
      );
      process.exit(4);
    }

    // eslint-disable-next-line no-console
    console.log('Event found and ok');
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
};

/**
 * Compares a test LogEvent (with validation expectations) to a source LogEvent
 * Values in the test object are by default compared to the ones of the source object using a strict equal comparison (===).
 * It is possible to use a regular expression for the comparison by providing a string starting with "RegExp:"
 * @param test object containing the key/value expectations
 * @param source LogEvent object to verify
 * @returns an array with the [key, value] from the source object not matching the test object expectations
 */
const getDifferences = (
  test: LogEvent,
  source: LogEvent,
): [string, string][] => {
  const REG_EXP_PREFIX = 'RegExp:';
  const isRegExpPattern = (value) =>
    typeof value === 'string' && value.startsWith(REG_EXP_PREFIX);
  const assertions = Object.entries(test).filter(([key, value]) => {
    if (isRegExpPattern(value)) {
      const regExp = new RegExp(value.replace(REG_EXP_PREFIX, ''));
      return !regExp.test(source[key]);
    }
    return source[key] !== value;
  });

  return assertions;
};

interactionHasEvent(process.argv.slice(2));
