/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsOctalValidator } from '../../interfaces';

export function $IsOctal(): IsOctalValidator {
  return { name: ValidatorJs.IS_OCTAL };
}
