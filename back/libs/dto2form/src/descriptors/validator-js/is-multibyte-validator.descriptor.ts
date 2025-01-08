import { ValidatorJs } from '../../enums';
import { IsMultibyteValidator } from '../../interfaces';

export function $IsMultibyte(): IsMultibyteValidator {
  return { name: ValidatorJs.IS_MULTIBYTE };
}
