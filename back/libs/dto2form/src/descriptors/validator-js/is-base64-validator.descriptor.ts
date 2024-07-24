/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsBase64Validator } from '../../interfaces';

export function $IsBase64(
  ...validationArgs: IsBase64Validator['validationArgs']
): IsBase64Validator {
  return {
    name: ValidatorJs.IS_BASE64,
    validationArgs,
  };
}
