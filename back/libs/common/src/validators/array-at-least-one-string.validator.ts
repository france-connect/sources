import {
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export const ARRAY_AT_LEAST_ONE_STRING = 'ArrayAtLeastOneString';

export function arrayAtLeastOneString(
  allowed: string[],
  values: string[],
): boolean {
  return allowed.some((elem) => values.includes(elem));
}

export class ArrayAtLeastOneStringConstraint {
  getAllowedList(args: ValidationArguments): string[] {
    return args.constraints[0];
  }

  validate(values: unknown, args: ValidationArguments): boolean {
    const allowed = this.getAllowedList(args);
    return Array.isArray(values) && arrayAtLeastOneString(allowed, values);
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
export function ArrayAtLeastOneString(
  allowed: string[],
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: ARRAY_AT_LEAST_ONE_STRING,
      constraints: [allowed],
      validator: ArrayAtLeastOneStringConstraint,
    },
    validationOptions,
  );
}
