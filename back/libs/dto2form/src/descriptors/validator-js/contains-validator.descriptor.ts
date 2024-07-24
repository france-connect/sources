/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { ContainsValidator } from '../../interfaces';

export function $Contains(
  ...validationArgs: ContainsValidator['validationArgs']
): ContainsValidator {
  return {
    name: ValidatorJs.CONTAINS,
    validationArgs,
  };
}
