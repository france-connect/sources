import { ValidatorJs } from '../../enums';
import { IsNumericValidator } from '../../interfaces';

export function $IsNumeric(
  ...validationArgs: IsNumericValidator['validationArgs']
): IsNumericValidator {
  return {
    name: ValidatorJs.IS_NUMERIC,
    validationArgs,
  };
}
