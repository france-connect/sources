import { ValidatorJs } from '../../enums';
import { IsMobilePhoneValidator } from '../../interfaces';

export function $IsMobilePhone(
  ...validationArgs: IsMobilePhoneValidator['validationArgs']
): IsMobilePhoneValidator {
  return {
    name: ValidatorJs.IS_MOBILE_PHONE,
    validationArgs,
  };
}
