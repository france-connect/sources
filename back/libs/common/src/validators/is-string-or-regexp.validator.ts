import { isString, ValidateBy, ValidationOptions } from 'class-validator';

export const IS_STRING_OR_REGEXP = 'IsStringOrRegExp';

export function isStringOrRegExp(values: unknown): boolean {
  return isString(values) || values instanceof RegExp;
}

export class IsStringOrRegExpConstraint {
  // proxy function
  /* istanbul ignore next */
  validate(values: unknown): boolean {
    return isStringOrRegExp(values);
  }

  defaultMessage() {
    return 'The value must be a string or RegExp';
  }
}

// declarative code
/* istanbul ignore next */
export function IsStringOrRegExp(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  // declarative code
  /* istanbul ignore next */
  return ValidateBy(
    {
      name: IS_STRING_OR_REGEXP,
      constraints: [],
      validator: new IsStringOrRegExpConstraint(),
    },
    validationOptions,
  );
}
