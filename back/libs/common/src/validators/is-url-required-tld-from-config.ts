import {
  isURL,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { OidcProviderConfig } from '@fc/oidc-provider/dto/oidc-provider-config.dto';

@ValidatorConstraint({ name: 'IsUrlRequiredTldFromConfig' })
@Injectable()
export class IsUrlRequiredTldFromConfigConstraint
  implements ValidatorConstraintInterface
{
  constructor(public readonly config: ConfigService) {}
  validate(url: string): boolean {
    const { isLocalhostAllowed } =
      this.config.get<OidcProviderConfig>('OidcProvider');

    return isURL(url, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      require_tld: !isLocalhostAllowed,
      // https protocol should be used for production environment,regardless of whether localhost is allowed or not.
      // for now we keep the logic that authorizes http protocol when localhost is allowed (integ only).
      protocols: isLocalhostAllowed ? ['http', 'https'] : ['https'],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      require_protocol: true,
    });
  }
  defaultMessage(): string {
    const { isLocalhostAllowed } =
      this.config.get<OidcProviderConfig>('OidcProvider');
    const invalidURL = 'URL is invalid';
    if (!isLocalhostAllowed) {
      return `${invalidURL} (localhost is disabled by configuration)`;
    }
    return `${invalidURL}`;
  }
}

export function IsUrlRequiredTldFromConfig(
  validationOptions?: ValidationOptions,
) {
  return function (object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUrlRequiredTldFromConfigConstraint,
    });
  };
}
