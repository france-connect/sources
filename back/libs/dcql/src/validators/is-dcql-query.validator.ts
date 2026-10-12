import {
  ValidateBy,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Injectable } from '@nestjs/common';

import { DcqlBaseException } from '../exceptions';
import { DcqlService } from '../services';

@ValidatorConstraint()
@Injectable()
export class IsDcqlQueryConstraint implements ValidatorConstraintInterface {
  constructor(private readonly dcql: DcqlService) {}

  validate(value: unknown): boolean {
    try {
      this.dcql.parse(value);

      return true;
    } catch (error) {
      if (error instanceof DcqlBaseException) {
        return false;
      }

      throw error;
    }
  }

  defaultMessage(): string {
    return 'The value must be a valid DCQL query';
  }
}

// declarative code
/* istanbul ignore next */
export function IsDcqlQuery(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsDcqlQuery',
      validator: IsDcqlQueryConstraint,
    },
    validationOptions,
  );
}
