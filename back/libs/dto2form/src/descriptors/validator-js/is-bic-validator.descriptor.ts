import { ValidatorJs } from '../../enums';
import { IsBICValidator } from '../../interfaces';

export function $IsBIC(): IsBICValidator {
  return { name: ValidatorJs.IS_BIC };
}
