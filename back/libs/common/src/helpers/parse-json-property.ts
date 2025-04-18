/**
 * Wrapper to JSON parse throwing explicit error in case of problem
 *
 * @param propertyName name of the property to JSON.parse
 * @param input object containing the property
 */
export function parseJsonProperty(
  input: object,
  propertyName: string,
): string | object {
  if (!(propertyName in input)) {
    throw TypeError(
      `property "${propertyName}" does not exists on object: ${JSON.stringify(
        input,
      )}`,
    );
  }

  try {
    return JSON.parse(input[propertyName]);
    // You can't remove the catch argument, it's mandatory
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw TypeError(
      `property "${propertyName}" is not JSON parsable, value was: ${input[propertyName]}`,
    );
  }
}
