import { ValidatorJs } from '../../enums';
import { IsDateValidator } from '../../interfaces';

export function $IsDate(
  ...validationArgs: IsDateValidator['validationArgs']
): IsDateValidator {
  return {
    name: ValidatorJs.IS_DATE,
    validationArgs,
  };
}
