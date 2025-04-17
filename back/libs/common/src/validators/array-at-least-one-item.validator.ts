import {
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
  Validator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export const ARRAY_AT_LEAST_ONE_ITEM = 'ArrayAtLeastOneItem';

export function arrayAtLeastOneItem(items: object[]): boolean {
  const validator = new Validator();
  return items
    .filter((item) => typeof item === 'object')
    .some((item) => {
      const errors = validator.validateSync(item);
      return errors.length === 0;
    });
}

@ValidatorConstraint()
export class ArrayAtLeastOneItemConstraint
  implements ValidatorConstraintInterface
{
  validate(items: object[], _args: ValidationArguments): boolean {
    return Array.isArray(items) && arrayAtLeastOneItem(items);
  }

  defaultMessage(): string {
    return "The array doesn't contain a valid item.";
  }
}

// declarative code
/* istanbul ignore next */
export function ArrayAtLeastOneItem(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: ARRAY_AT_LEAST_ONE_ITEM,
      validator: ArrayAtLeastOneItemConstraint,
    },
    validationOptions,
  );
}
