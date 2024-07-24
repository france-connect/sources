/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsVATValidator } from '../../interfaces';

export function $IsVAT(
  ...validationArgs: IsVATValidator['validationArgs']
): IsVATValidator {
  return {
    name: ValidatorJs.IS_VAT,
    validationArgs,
  };
}
