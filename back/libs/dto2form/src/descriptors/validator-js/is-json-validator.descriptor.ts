/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsJSONValidator } from '../../interfaces';

export function $IsJSON(
  ...validationArgs: IsJSONValidator['validationArgs']
): IsJSONValidator {
  return {
    name: ValidatorJs.IS_JSON,
    validationArgs,
  };
}
