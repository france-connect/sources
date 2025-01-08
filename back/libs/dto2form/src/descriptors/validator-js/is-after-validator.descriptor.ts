import { ValidatorJs } from '../../enums';
import { IsAfterValidator } from '../../interfaces';

export function $IsAfter(
  ...validationArgs: IsAfterValidator['validationArgs']
): IsAfterValidator {
  return {
    name: ValidatorJs.IS_AFTER,
    validationArgs,
  };
}
