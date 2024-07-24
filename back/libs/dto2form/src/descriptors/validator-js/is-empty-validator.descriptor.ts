/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsEmptyValidator } from '../../interfaces';

export function $IsEmpty(): IsEmptyValidator {
  return { name: ValidatorJs.IS_EMPTY };
}
