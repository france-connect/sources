/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsISSNValidator } from '../../interfaces';

export function $IsISSN(
  ...validationArgs: IsISSNValidator['validationArgs']
): IsISSNValidator {
  return {
    name: ValidatorJs.IS_ISSN,
    validationArgs,
  };
}
