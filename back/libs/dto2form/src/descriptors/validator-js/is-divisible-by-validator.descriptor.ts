/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsDivisibleByValidator } from '../../interfaces';

export function $IsDivisibleBy(
  ...validationArgs: IsDivisibleByValidator['validationArgs']
): IsDivisibleByValidator {
  return {
    name: ValidatorJs.IS_DIVISIBLE_BY,
    validationArgs,
  };
}
