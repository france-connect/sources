/**
 * Log data in native console to help debugging
 * @param {unknow[]} messages elements to display in the console
 */
export const log = (...messages: unknown[]): null => {
  // eslint-disable-next-line no-console
  console.log('[console]: ', ...messages);

  return null;
};

export const table = (tabularData: unknown[]): null => {
  // eslint-disable-next-line no-console
  console.table(tabularData);
  return null;
};
