/**
 * Wrapper to JSON parse throwing explicit error in case of problem
 *
 * @param propertyName name of the property to JSON.parse
 * @param input object containing the property
 */
export function safelyParseJson(input: string): any {
  const cleaner = (key, value) => (key === '__proto__' ? undefined : value);

  try {
    return JSON.parse(input, cleaner);
  } catch (error) {
    throw TypeError('JSON not parsable');
  }
}
