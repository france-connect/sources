import { ValidatorJs } from '../../enums';
import { IsBase32Validator } from '../../interfaces';

export function $IsBase32(
  ...validationArgs: IsBase32Validator['validationArgs']
): IsBase32Validator {
  return {
    name: ValidatorJs.IS_BASE32,
    validationArgs,
  };
}
