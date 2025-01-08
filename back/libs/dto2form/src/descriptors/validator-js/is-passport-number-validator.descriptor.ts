import { ValidatorJs } from '../../enums';
import { IsPassportNumberValidator } from '../../interfaces';

export function $IsPassportNumber(
  ...validationArgs: IsPassportNumberValidator['validationArgs']
): IsPassportNumberValidator {
  return {
    name: ValidatorJs.IS_PASSPORT_NUMBER,
    validationArgs,
  };
}
