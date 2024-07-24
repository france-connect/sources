/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsMailtoURIValidator } from '../../interfaces';

export function $IsMailtoURI(
  ...validationArgs: IsMailtoURIValidator['validationArgs']
): IsMailtoURIValidator {
  return {
    name: ValidatorJs.IS_MAILTO_URI,
    validationArgs,
  };
}
