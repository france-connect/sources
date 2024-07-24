/* istanbul ignore file */

// declarative file
import { IsNotEmptyValidator } from '@fc/dto2form/interfaces';

import { ValidatorCustom } from '../../enums';

export function $IsNotEmpty(): IsNotEmptyValidator {
  return { name: ValidatorCustom.IS_NOT_EMPTY };
}
