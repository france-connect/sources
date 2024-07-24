/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsHashValidator } from '../../interfaces';

export function $IsHash(
  ...validationArgs: IsHashValidator['validationArgs']
): IsHashValidator {
  return {
    name: ValidatorJs.IS_HASH,
    validationArgs,
  };
}
