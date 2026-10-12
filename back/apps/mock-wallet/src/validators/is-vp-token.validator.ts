import { ValidateBy, ValidationOptions } from 'class-validator';

export const IS_VP_TOKEN = 'IsVpToken';

function isPresentation(value: unknown): boolean {
  return typeof value === 'string' && value.length > 0;
}

function isPresentationArray(value: unknown): boolean {
  return (
    Array.isArray(value) && value.length > 0 && value.every(isPresentation)
  );
}

function isPlainObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDcqlVpToken(value: object): boolean {
  const presentationsById = Object.values(value);

  return (
    presentationsById.length > 0 && presentationsById.every(isPresentationArray)
  );
}

export function isVpToken(value: unknown): boolean {
  if (typeof value === 'string') {
    return isPresentation(value);
  }

  if (!isPlainObject(value)) {
    return false;
  }

  return isDcqlVpToken(value);
}

export class IsVpTokenConstraint {
  validate(value: unknown): boolean {
    return isVpToken(value);
  }

  defaultMessage() {
    return 'vp_token must be a presentation string or an object mapping credential query ids to arrays of presentations';
  }
}

// declarative code
/* istanbul ignore next */
export function IsVpToken(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_VP_TOKEN,
      constraints: [],
      validator: new IsVpTokenConstraint(),
    },
    validationOptions,
  );
}
