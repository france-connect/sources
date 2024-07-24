/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsPortValidator } from '../../interfaces';

export function $IsPort(): IsPortValidator {
  return { name: ValidatorJs.IS_PORT };
}
