import { ValidatorJs } from '../../enums';
import { IsStrongPasswordValidator } from '../../interfaces';

export function $IsStrongPassword(
  ...validationArgs: IsStrongPasswordValidator['validationArgs']
): IsStrongPasswordValidator {
  return {
    name: ValidatorJs.IS_STRONG_PASSWORD,
    validationArgs,
  };
}
