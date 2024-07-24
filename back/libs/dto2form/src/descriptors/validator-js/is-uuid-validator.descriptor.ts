/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsUUIDValidator } from '../../interfaces';

export function $IsUUID(
  ...validationArgs: IsUUIDValidator['validationArgs']
): IsUUIDValidator {
  return {
    name: ValidatorJs.IS_UUID,
    validationArgs,
  };
}
