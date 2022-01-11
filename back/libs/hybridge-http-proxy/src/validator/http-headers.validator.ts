import {
  isAscii,
  isObject,
  ValidateBy,
  ValidationOptions,
} from 'class-validator';

export const VALIDATE_HTTP_HEADERS = 'ValidateHttpHeaders';

export function isHttpHeaders(values: object) {
  const params = Object.entries(values);
  const check = params.every(([key, value]) => isAscii(key) && isAscii(value));
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
