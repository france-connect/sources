/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsISINValidator } from '../../interfaces';

export function $IsISIN(): IsISINValidator {
  return { name: ValidatorJs.IS_ISIN };
}
