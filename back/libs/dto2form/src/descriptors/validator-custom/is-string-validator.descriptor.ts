import { ValidatorCustom } from '../../enums';
import { IsStringValidator } from '../../interfaces';

export function $IsString(): IsStringValidator {
  return {
    name: ValidatorCustom.IS_STRING,
  };
}
