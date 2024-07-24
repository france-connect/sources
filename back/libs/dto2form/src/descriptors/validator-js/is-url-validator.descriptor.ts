/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsURLValidator } from '../../interfaces';

export function $IsURL(
  ...validationArgs: IsURLValidator['validationArgs']
): IsURLValidator {
  return {
    name: ValidatorJs.IS_URL,
    validationArgs,
  };
}
