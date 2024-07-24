/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsAsciiValidator } from '../../interfaces';

export function $IsAscii(): IsAsciiValidator {
  return { name: ValidatorJs.IS_ASCII };
}
