import { ValidatorJs } from '../../enums';
import { IsAlphanumericValidator } from '../../interfaces';

export function $IsAlphanumeric(
  ...validationArgs: IsAlphanumericValidator['validationArgs']
): IsAlphanumericValidator {
  return {
    name: ValidatorJs.IS_ALPHANUMERIC,
    validationArgs,
  };
}
