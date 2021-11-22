/**
 * Log data in native console to help debugging
 * @param {Array} array of arguments to display in console
 */
function logInConsole(messages) {
  // eslint-disable-next-line no-console
  console.log('[console]:', ...messages);
  // asked by Cypress to consider task done
  return null;
}

module.exports = {
  logInConsole,
};
