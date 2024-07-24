/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsAlphaValidator } from '../../interfaces';

export function $IsAlpha(
  ...validationArgs: IsAlphaValidator['validationArgs']
): IsAlphaValidator {
  return {
    name: ValidatorJs.IS_ALPHA,
    validationArgs,
  };
}
