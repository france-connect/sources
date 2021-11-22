// Inputs to be casted as `true`
const truthy = ['true', 'on', '1', true, 1];

// Inputs to be casted as `false`
const falsy = ['false', 'off', '0', false, 0];

/**
 * parese input and return the boolean value according to mappging defined
 * in `truthy` and `falsy` variable defined above.
 *
 * Any input not in those mappings will result in an `undefined` result
 *
 * This helper function is used to cast data from process.env in config files.
 */
export function parseBoolean(
  property: number | boolean | string,
): boolean | undefined {
  if (truthy.includes(property)) {
    return true;
  } else if (falsy.includes(property)) {
    return false;
  } else {
    return undefined;
  }
}
