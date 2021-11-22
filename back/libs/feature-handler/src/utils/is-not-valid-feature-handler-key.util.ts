import { isString } from 'class-validator';

/**
 * Check if the value is a valid feature handler key
 *
 * @param value The value to test
 * @returns {boolean}
 */
export function isNotValidFeatureHandlerKey(value: unknown): boolean {
  return value !== null && (!isString(value) || value === '');
}
