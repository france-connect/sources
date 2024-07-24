/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsSurrogatePairValidator } from '../../interfaces';

export function $IsSurrogatePair(): IsSurrogatePairValidator {
  return { name: ValidatorJs.IS_SURROGATE_PAIR };
}
