import { ValidatorJs } from '../../enums';
import { IsISO31661Alpha3Validator } from '../../interfaces';

export function $IsISO31661Alpha3(): IsISO31661Alpha3Validator {
  return { name: ValidatorJs.IS_ISO31661_ALPHA3 };
}
