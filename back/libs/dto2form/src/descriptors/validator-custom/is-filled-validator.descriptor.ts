import { ValidatorCustom } from '../../enums';
import { IsFilledValidator } from '../../interfaces';

export function $IsFilled(): IsFilledValidator {
  return { name: ValidatorCustom.IS_FILLED };
}
