import { ValidatorJs } from '../../enums';
import { IsHexadecimalValidator } from '../../interfaces';

export function $IsHexadecimal(): IsHexadecimalValidator {
  return { name: ValidatorJs.IS_HEXADECIMAL };
}
