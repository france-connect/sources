import { ValidatorJs } from '../../enums';
import { IsISO31661Alpha2Validator } from '../../interfaces';

export function $IsISO31661Alpha2(): IsISO31661Alpha2Validator {
  return { name: ValidatorJs.IS_ISO31661_ALPHA2 };
}
