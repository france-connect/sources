/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { EqualsValidator } from '../../interfaces';

export function $Equals(
  ...validationArgs: EqualsValidator['validationArgs']
): EqualsValidator {
  return {
    name: ValidatorJs.EQUALS,
    validationArgs,
  };
}
