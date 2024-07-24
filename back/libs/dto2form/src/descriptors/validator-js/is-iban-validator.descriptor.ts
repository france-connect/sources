/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsIBANValidator } from '../../interfaces';

export function $IsIBAN(
  ...validationArgs: IsIBANValidator['validationArgs']
): IsIBANValidator {
  return {
    name: ValidatorJs.IS_IBAN,
    validationArgs,
  };
}
