import { ValidatorJs } from '../../enums';
import { IsEANValidator } from '../../interfaces';

export function $IsEAN(): IsEANValidator {
  return { name: ValidatorJs.IS_EAN };
}
