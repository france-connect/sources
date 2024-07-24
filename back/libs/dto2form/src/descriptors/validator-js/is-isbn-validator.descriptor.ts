/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsISBNValidator } from '../../interfaces';

export function $IsISBN(
  ...validationArgs: IsISBNValidator['validationArgs']
): IsISBNValidator {
  return {
    name: ValidatorJs.IS_ISBN,
    validationArgs,
  };
}
