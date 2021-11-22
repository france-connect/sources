/**
 * Creates an array of array values not included in the other given arrays
 * @param {Array} array1
 * @param {String|Array} array2
 */
export function difference(
  array: string[],
  values: string | string[],
): string[] {
  return array.filter((x) => !values.includes(x));
}
