import { ValidatorJs } from '../../enums';
import { IsFullWidthValidator } from '../../interfaces';

export function $IsFullWidth(): IsFullWidthValidator {
  return { name: ValidatorJs.IS_FULL_WIDTH };
}
