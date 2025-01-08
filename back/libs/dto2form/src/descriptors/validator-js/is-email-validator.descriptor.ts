import { ValidatorJs } from '../../enums';
import { IsEmailValidator } from '../../interfaces';

export function $IsEmail(
  ...validationArgs: IsEmailValidator['validationArgs']
): IsEmailValidator {
  return {
    name: ValidatorJs.IS_EMAIL,
    validationArgs,
  };
}
