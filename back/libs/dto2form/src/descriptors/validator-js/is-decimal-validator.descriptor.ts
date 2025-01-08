import { ValidatorJs } from '../../enums';
import { IsDecimalValidator } from '../../interfaces';

export function $IsDecimal(
  ...validationArgs: IsDecimalValidator['validationArgs']
): IsDecimalValidator {
  return {
    name: ValidatorJs.IS_DECIMAL,
    validationArgs,
  };
}
