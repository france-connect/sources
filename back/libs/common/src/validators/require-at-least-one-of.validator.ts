import {
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export const REQUIRE_AT_LEAST_ONE_OF = 'RequireAtLeastOneOf';

export function requireAtLeastOneOf(
  object: Record<string, unknown>,
  properties: string[],
): boolean {
  return properties.some((prop) => Boolean(object[prop]));
}

@ValidatorConstraint({ name: REQUIRE_AT_LEAST_ONE_OF })
export class RequireAtLeastOneOfConstraint implements ValidatorConstraintInterface {
  public validator = requireAtLeastOneOf;

  validate(value: unknown, args: ValidationArguments): boolean {
    const [properties] = args.constraints as [string[]];
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    return this.validator(value as Record<string, unknown>, properties);
  }

  defaultMessage(args: ValidationArguments): string {
    const [properties] = args.constraints as [string[]];
    return `At least one of ${properties.join(', ')} must be provided`;
  }
}

// declarative code
/* istanbul ignore next */
export function RequireAtLeastOneOf(
  properties: string[],
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: REQUIRE_AT_LEAST_ONE_OF,
      constraints: [properties],
      validator: RequireAtLeastOneOfConstraint,
    },
    validationOptions,
  );
}
