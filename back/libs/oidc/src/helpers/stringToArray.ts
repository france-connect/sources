import { unique } from '@fc/common';

/**
 * Create an array from a string
 * @param {string} value
 * @param {string} delimiter
 * @param {boolean} newSet
 *
 * @returns {string[]}
 */
export function stringToArray(value: string): string[] {
  const toArray = value.trim().split(' ').filter(Boolean);
  return unique(toArray);
}
