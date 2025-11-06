import {
  isURL,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';

import { MustEndWith } from '../types';

@ValidatorConstraint({ name: 'IsUrlRequiredTldFromConfig' })
@Injectable()
export class IsUrlRequiredTldFromConfigConstraint
  implements ValidatorConstraintInterface
{
  constructor(public readonly config: ConfigService) {}

  validate(url: string, { constraints }: ValidationArguments): boolean {
    const [className, property] = constraints;
    const { [property]: requireTld } =
      this.config.get<Record<string, boolean>>(className);

    return isURL(url, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      require_tld: requireTld,
      // https protocol should be used for production environment,regardless of whether localhost is allowed or not.
      // for now we keep the logic that authorizes http protocol when localhost is allowed (integ only).
      protocols: !requireTld ? ['http', 'https'] : ['https'],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      require_protocol: true,
    });
  }

  defaultMessage(): string {
    return 'URL is invalid';
  }
}

export function IsUrlRequiredTldFromConfig<T>(
  className: string,
  property: keyof T & MustEndWith<'RequireTld'>,
  validationOptions?: ValidationOptions,
) {
  return function (object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [className, property],
      validator: IsUrlRequiredTldFromConfigConstraint,
    });
  };
}
