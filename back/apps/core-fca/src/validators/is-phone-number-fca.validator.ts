import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';

const phoneRegex = /^\+?(?:[0-9][ -]?){6,14}[0-9]$/;

@ValidatorConstraint({ name: 'IsPhoneNumberFca' })
@Injectable()
export class IsPhoneNumberFCAConstraint
  implements ValidatorConstraintInterface
{
  constructor(public readonly config: ConfigService) {}
  validate(value: string): boolean {
    return typeof value === 'string' && phoneRegex.test(value);
  }

  defaultMessage(): string {
    return `Le numéro de téléphone est invalide.`;
  }
}

export function IsPhoneNumberFca(validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberFCAConstraint,
    });
  };
}
