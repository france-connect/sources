/**
 * Get current local Date in string.
 *
 * @returns {string} current string date, Ex:
 */
export const getDateTime: Function = (): string =>
  new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Europe/Paris',
    hour12: false,
  });

/**
 * Parse current stack execution to extract the current
 * Class's method name.
 *
 * @returns {string} Name of the currently called method's name.
 */
export const getClassMethodCaller: Function = (): string => {
  const { stack } = new Error();
  const methodName = stack.split('at ')[3].split(' ')[0];
  return methodName;
};

/**
 * Convert `camelCase` to `snakeCase` string without the last uppercase element
 * of the the input string. Ex: `helloWorldElement` > `hello-world`
 * We need to remove the last element because it could be
 * `Service`, `Controller`, `Adapter`, `Model`, `Handler`...
 *
 * @param {string} str string input to convert.
 * @returns {string}
 */
export const slugLibName: Function = (name: string): string => {
  const SEPARATOR = '-';

  return name
    .split(/(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .slice(0, -1) // remove `Service`, `Controller`...
    .join(SEPARATOR);
};
