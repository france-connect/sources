import {
  isURL,
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

import { X509_CLIENT_ID_SCHEMES } from '../constants';
import {
  Openid4vpClientIdPrefixEnum,
  Openid4vpClientIdSchemeEnum,
} from '../enums';

export const IS_OPENID4VP_CLIENT_ID = 'IsOpenid4vpClientId';

export function isClientId(
  value: string,
  clientIdScheme: Openid4vpClientIdSchemeEnum,
): boolean {
  if (X509_CLIENT_ID_SCHEMES.includes(clientIdScheme)) {
    return value.startsWith(Openid4vpClientIdPrefixEnum.X509_HASH);
  }

  if (clientIdScheme === Openid4vpClientIdSchemeEnum.REDIRECT_URI) {
    return isURL(value);
  }

  return false;
}

export class IsClientIdConstraint {
  validate(values: string, args: ValidationArguments): boolean {
    return isClientId(values, args.object['client_id_scheme']);
  }

  defaultMessage() {
    return 'The value must be a valid client_id';
  }
}

// declarative code
/* istanbul ignore next */
export function IsClientId(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  // declarative code
  /* istanbul ignore next */
  return ValidateBy(
    {
      name: IS_OPENID4VP_CLIENT_ID,
      constraints: [],
      validator: new IsClientIdConstraint(),
    },
    validationOptions,
  );
}
