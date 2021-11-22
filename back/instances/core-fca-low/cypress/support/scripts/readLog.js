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
  return rawData.split('\n').filter(Boolean);
}

async function logHasEntry([logFile, term]) {
  try {
    const logs = await loadLog(logFile);
    const input = Buffer.from(term, 'base64').toString('utf8');

    const foundEvent = logs.find((log) => log.includes(input));

    if (!foundEvent) {
      console.error('log not found');
      process.exit(3);
    }

    console.log('log found');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

logHasEntry(process.argv.slice(2));
