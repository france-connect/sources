/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsIMEIValidator } from '../../interfaces';

export function $IsIMEI(
  ...validationArgs: IsIMEIValidator['validationArgs']
): IsIMEIValidator {
  return {
    name: ValidatorJs.IS_IMEI,
    validationArgs,
  };
}
