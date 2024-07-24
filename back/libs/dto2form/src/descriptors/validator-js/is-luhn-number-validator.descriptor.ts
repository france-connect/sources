/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsLuhnNumberValidator } from '../../interfaces';

export function $IsLuhnNumber(): IsLuhnNumberValidator {
  return { name: ValidatorJs.IS_LUHN_NUMBER };
}
