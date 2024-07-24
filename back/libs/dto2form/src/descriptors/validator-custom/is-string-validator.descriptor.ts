/* istanbul ignore file */

// declarative file
import { IsStringValidator } from '@fc/dto2form/interfaces';

import { ValidatorCustom } from '../../enums';

export function $IsString(): IsStringValidator {
  return {
    name: ValidatorCustom.IS_STRING,
  };
}
