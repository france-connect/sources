import { ValidatorJs } from '../../enums';
import { IsJWTValidator } from '../../interfaces';

export function $IsJWT(
  ...validationArgs: IsJWTValidator['validationArgs']
): IsJWTValidator {
  return {
    name: ValidatorJs.IS_JWT,
    validationArgs,
  };
}
