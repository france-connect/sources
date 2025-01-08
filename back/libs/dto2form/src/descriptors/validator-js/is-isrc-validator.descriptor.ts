import { ValidatorJs } from '../../enums';
import { IsISRCValidator } from '../../interfaces';

export function $IsISRC(): IsISRCValidator {
  return { name: ValidatorJs.IS_ISRC };
}
