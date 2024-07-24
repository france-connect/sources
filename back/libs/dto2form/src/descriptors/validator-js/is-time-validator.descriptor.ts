/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsTimeValidator } from '../../interfaces';

export function $IsTime(
  ...validationArgs: IsTimeValidator['validationArgs']
): IsTimeValidator {
  return {
    name: ValidatorJs.IS_TIME,
    validationArgs,
  };
}
