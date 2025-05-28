/**
 * Method to split a string into two parts
 * @param {str} String
 */
export function splitInTwoParts(str: string): string[] {
  const mid = Math.ceil(str.length / 2);
  const part1 = str.slice(0, mid);
  const part2 = str.slice(mid);

  return [part1, part2];
}
