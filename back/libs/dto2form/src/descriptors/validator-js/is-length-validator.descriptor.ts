/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsLengthValidator } from '../../interfaces';

export function $IsLength(
  ...validationArgs: IsLengthValidator['validationArgs']
): IsLengthValidator {
  return {
    name: ValidatorJs.IS_LENGTH,
    validationArgs,
  };
}
