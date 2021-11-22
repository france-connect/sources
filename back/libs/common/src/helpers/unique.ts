/**
 * Create an array which only the first occurrence of each element is kept
 * @param {Array} array
 */
export function unique(array: string[]): string[] {
  return [...new Set(array)];
}
