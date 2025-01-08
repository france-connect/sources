import { ValidatorJs } from '../../enums';
import { IsHalfWidthValidator } from '../../interfaces';

export function $IsHalfWidth(): IsHalfWidthValidator {
  return { name: ValidatorJs.IS_HALF_WIDTH };
}
