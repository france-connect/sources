/**
 * Wrapper to JSON parse throwing explicit error in case of problem
 *
 * @param input object containing the property
 */
export function safelyParseJson(input: string): unknown {
  const cleaner = (key: string, value: unknown) =>
    key === '__proto__' ? undefined : value;

  try {
    return JSON.parse(input, cleaner);
  } catch (error) {
    throw TypeError('JSON not parsable');
  }
}
