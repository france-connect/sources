import {
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export const ARRAY_AT_LEAST_ONE = 'ArrayAtLeastOne';

export function arrayAtLeastOne(allowed: string[], values: string[]): boolean {
  return allowed.some((elem) => values.includes(elem));
}

export class ArrayAtLeastOneConstraint {
  getAllowedList(args: ValidationArguments): string[] {
    return args.constraints[0];
  }

  validate(values: unknown, args: ValidationArguments): boolean {
    const allowed = this.getAllowedList(args);
    return Array.isArray(values) && arrayAtLeastOne(allowed, values);
  }

  defaultMessage(args: ValidationArguments) {
    const values = args.value;
    const allowed = this.getAllowedList(args);
    const output = Array.isArray(values) ? values.join(', ') : `${values}`;
    return `${args.property} allows only theses values: "${allowed.join(
      ', ',
    )}", got: "${output}"`;
  }
}

// declarative code
/* istanbul ignore next */
export function ArrayAtLeastOne(
  allowed: string[],
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  // declarative code
  /* istanbul ignore next */
  return ValidateBy(
    {
      name: ARRAY_AT_LEAST_ONE,
      constraints: [allowed],
      validator: ArrayAtLeastOneConstraint,
    },
    validationOptions,
  );
}
