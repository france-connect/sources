import { parse } from 'secure-json-parse';

import { OverrideCode } from '@fc/override-code';

/**
 * Wrapper to JSON parse throwing explicit error in case of problem
 *
 * @param propertyName name of the property to JSON.parse
 * @param input object containing the property
 */
export function safelyParseJson(input: string): any {
  try {
    return parse(input, { protoAction: 'remove' });
  } catch (error) {
    throw TypeError('JSON not parsable');
  }
}

/**
 *
 * Function to use in OverrideCode.wrap to override JSON.parse
 *
 * secure-json-parse rely on native JSON.parse under the hood,
 * so we need to give access to the original function from within the override.
 */
export function overriddenBySafelyParseJson(input: string): any {
  return OverrideCode.execWithOriginal(JSON, 'parse', 'JSON.parse', () =>
    parse(input),
  );
}
