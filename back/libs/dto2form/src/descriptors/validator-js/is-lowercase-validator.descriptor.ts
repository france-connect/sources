/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsLowercaseValidator } from '../../interfaces';

export function $IsLowercase(): IsLowercaseValidator {
  return { name: ValidatorJs.IS_LOWERCASE };
}
