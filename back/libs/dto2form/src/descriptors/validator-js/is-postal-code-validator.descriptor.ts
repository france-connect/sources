import { ValidatorJs } from '../../enums';
import { IsPostalCodeValidator } from '../../interfaces';

export function $IsPostalCode(
  ...validationArgs: IsPostalCodeValidator['validationArgs']
): IsPostalCodeValidator {
  return {
    name: ValidatorJs.IS_POSTAL_CODE,
    validationArgs,
  };
}
