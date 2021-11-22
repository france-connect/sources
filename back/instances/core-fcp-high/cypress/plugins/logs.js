// eslint-disable-next-line @typescript-eslint/no-var-requires
const { readFileSync, existsSync, truncateSync } = require('fs');

/**
 * allow to clear log file for test
 * @param {string} uri path of the log file
 */
function clearLogsFile(uri) {
  const fileExists = existsSync(uri);

  if (fileExists) {
    truncateSync(uri);
  }
  return fileExists;
}

function getLogFile(path) {
  if (!existsSync(path)) {
    return false;
  }
  const logFile = readFileSync(path, 'utf-8');
  return logFile
}

module.exports = {
  getLogFile,
  clearLogsFile
};
