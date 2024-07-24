/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsBase58Validator } from '../../interfaces';

export function $IsBase58(): IsBase58Validator {
  return { name: ValidatorJs.IS_BASE58 };
}
