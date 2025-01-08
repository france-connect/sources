import { ValidatorJs } from '../../enums';
import { IsFloatValidator } from '../../interfaces';

export function $IsFloat(
  ...validationArgs: IsFloatValidator['validationArgs']
): IsFloatValidator {
  return {
    name: ValidatorJs.IS_FLOAT,
    validationArgs,
  };
}
