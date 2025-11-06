import { ValidatorCustom } from '../../enums';
import { IsTrueValidator } from '../../interfaces';

export function $IsTrue(): IsTrueValidator {
  return { name: ValidatorCustom.IS_TRUE };
}
