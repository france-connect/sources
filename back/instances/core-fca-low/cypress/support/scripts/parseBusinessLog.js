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
 * > node parseBusinessLog.js '/path/to/file.log' '{"JSON": "string", "test": "object"}'
 */

// This file is executed without any transpiller
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

async function loadLog(path) {
  const rawData = await fs.readFileSync(path).toString('utf8');
  return rawData
    .split('\n')
    .filter(Boolean)
    .map((row) => JSON.parse(row));
}

async function interactionHasEvent([logFile, stringifiedTestEvent]) {
  try {
    const logs = await loadLog(logFile);
    const testEvent = JSON.parse(stringifiedTestEvent);

    /**
     * First check only on basic keys.
     *
     * This allows us to retrieve a failling log,
     * rather than having no match at all,
     * usefull for debuging purpose.
     */
    const foundEvent = logs.find((log) => log.event === testEvent.event);

    if (!foundEvent) {
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
      console.error('Event mismatch');
      console.error(`Diff: ${JSON.stringify(differences)}`);
      console.error(`Found event: ${JSON.stringify(foundEvent)}`);
      console.error(`Test event: ${JSON.stringify(testEvent)}`);
      process.exit(4);
    }

    console.log('Event found and ok');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

function getDifferences(test, source) {
  const assertions = Object.entries(test).filter(
    ([key, value]) => source[key] !== value,
  );

  return assertions;
}

interactionHasEvent(process.argv.slice(2));
