/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsWhitelistedValidator } from '../../interfaces';

export function $IsWhitelisted(
  ...validationArgs: IsWhitelistedValidator['validationArgs']
): IsWhitelistedValidator {
  return {
    name: ValidatorJs.IS_WHITELISTED,
    validationArgs,
  };
}
