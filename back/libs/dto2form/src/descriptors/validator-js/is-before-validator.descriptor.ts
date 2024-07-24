/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsBeforeValidator } from '../../interfaces';

export function $IsBefore(
  ...validationArgs: IsBeforeValidator['validationArgs']
): IsBeforeValidator {
  return {
    name: ValidatorJs.IS_BEFORE,
    validationArgs,
  };
}
