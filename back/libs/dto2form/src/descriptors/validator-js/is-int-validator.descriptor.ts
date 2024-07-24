/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsIntValidator } from '../../interfaces';

export function $IsInt(
  ...validationArgs: IsIntValidator['validationArgs']
): IsIntValidator {
  return {
    name: ValidatorJs.IS_INT,
    validationArgs,
  };
}
