/**
 * Creates an array of unique values that are included in all given arrays
 * @param {Array} array1
 * @param {String|Array} array2
 */
export function intersection(
  array: string[],
  value: string | string[],
): string[] {
  return array.filter((x) => value.includes(x));
}
