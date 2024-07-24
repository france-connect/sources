/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsMD5Validator } from '../../interfaces';

export function $IsMD5(): IsMD5Validator {
  return { name: ValidatorJs.IS_MD5 };
}
