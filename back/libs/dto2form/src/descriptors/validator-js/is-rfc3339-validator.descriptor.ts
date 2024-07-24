/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsRFC3339Validator } from '../../interfaces';

export function $IsRFC3339(): IsRFC3339Validator {
  return { name: ValidatorJs.IS_RFC3339 };
}
