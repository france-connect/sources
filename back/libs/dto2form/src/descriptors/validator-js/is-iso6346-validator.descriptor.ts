import { ValidatorJs } from '../../enums';
import { IsISO6346Validator } from '../../interfaces';

export function $IsISO6346(): IsISO6346Validator {
  return { name: ValidatorJs.IS_ISO6346 };
}
