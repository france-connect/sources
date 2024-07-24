import {
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';

@ValidatorConstraint()
@Injectable()
export class IsIncludedInConfigConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly config: ConfigService) {}

  validate(values: unknown, { constraints }: ValidationArguments): boolean {
    const [className, property] = constraints;

    const { [property]: allowed } =
      this.config.get<Record<string, unknown>>(className);

    if (Array.isArray(allowed) && Array.isArray(values)) {
      return values.every((value) => allowed.includes(value));
    }

    if (Array.isArray(allowed)) {
      return allowed.includes(values);
    }

    return false;
  }

  defaultMessage({ constraints, value }: ValidationArguments): string {
    const [className, property] = constraints;

    const { [property]: allowed } =
      this.config.get<Record<string, unknown>>(className);

    return `${property} allows only theses values: "${allowed}", got: "${value}"`;
  }
}

// declarative code
/* istanbul ignore next */
export function IsIncludedInConfig<T>(
  className: string,
  property: keyof T,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsIncludedInConfig',
      constraints: [className, property],
      validator: IsIncludedInConfigConstraint,
    },
    validationOptions,
  );
}
