import { ValidatorJs } from '../../enums';
import { IsUppercaseValidator } from '../../interfaces';

export function $IsUppercase(): IsUppercaseValidator {
  return { name: ValidatorJs.IS_UPPERCASE };
}
