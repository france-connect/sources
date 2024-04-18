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
export class IsEqualToConfigConstraint implements ValidatorConstraintInterface {
  constructor(private readonly config: ConfigService) {}

  validate(values: unknown, { constraints }: ValidationArguments): boolean {
    const [className, property] = constraints;

    const { [property]: allowed } =
      this.config.get<Record<string, unknown>>(className);

    return allowed === values;
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
export function IsEqualToConfig<T>(
  className: string,
  property: keyof T,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsEqualToConfig',
      constraints: [className, property],
      validator: IsEqualToConfigConstraint,
    },
    validationOptions,
  );
}
