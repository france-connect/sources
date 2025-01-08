import { ValidatorJs } from '../../enums';
import { IsISO4217Validator } from '../../interfaces';

export function $IsISO4217(): IsISO4217Validator {
  return { name: ValidatorJs.IS_ISO4217 };
}
