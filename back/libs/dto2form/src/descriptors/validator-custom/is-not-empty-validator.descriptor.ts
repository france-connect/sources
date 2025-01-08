import { ValidatorCustom } from '../../enums';
import { IsNotEmptyValidator } from '../../interfaces';

export function $IsNotEmpty(): IsNotEmptyValidator {
  return { name: ValidatorCustom.IS_NOT_EMPTY };
}
