import {
  isAscii,
  isObject,
  maxLength,
  ValidateBy,
  ValidationOptions,
} from 'class-validator';

export const VALIDATE_HTTP_HEADERS = 'ValidateHttpHeaders';

export const MAX_LENGTH = 1024;

export function isHttpHeaders(values: object) {
  const params = Object.entries(values);
  const check = params.every(
    ([key, value]) =>
      isAscii(key) && isAscii(value) && maxLength(value, MAX_LENGTH),
  );
  return check;
}
export class ValidateHttpHeadersConstraint {
  validate(values: unknown): boolean {
    return isObject(values) && isHttpHeaders(values);
  }

  defaultMessage() {
    return 'Please check the HTTP headers values';
  }
}

// declarative code
/* istanbul ignore next */
export function ValidateHttpHeaders(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  // declarative code
  /* istanbul ignore next */
  return ValidateBy(
    {
      name: VALIDATE_HTTP_HEADERS,
      constraints: [],
      validator: new ValidateHttpHeadersConstraint(),
    },
    validationOptions,
  );
}
