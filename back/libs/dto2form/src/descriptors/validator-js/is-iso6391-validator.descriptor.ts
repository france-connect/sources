import { ValidatorJs } from '../../enums';
import { IsISO6391Validator } from '../../interfaces';

export function $IsISO6391(): IsISO6391Validator {
  return { name: ValidatorJs.IS_ISO6391 };
}
