/**
 * Creates an union's array of unique values
 * @param {Array} array1
 * @param {String|Array} array2
 */
export function union(array1: string[], array2: string[]): string[] {
  return [...array1, ...array2];
}
