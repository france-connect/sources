import { Matches, matches, ValidationOptions } from 'class-validator';

const SAFE_STRING_REGEX = /^[^.*?{}()|[\]\t\r\n\\]*$/;

export function isSafeString(value: string) {
  return matches(value, SAFE_STRING_REGEX);
}

// declarative code
/* istanbul ignore next */
export function IsSafeString(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  // declarative code
  /* istanbul ignore next */
  return Matches(SAFE_STRING_REGEX, validationOptions);
}
