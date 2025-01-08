import { ValidatorJs } from '../../enums';
import { IsLicensePlateValidator } from '../../interfaces';

export function $IsLicensePlate(
  ...validationArgs: IsLicensePlateValidator['validationArgs']
): IsLicensePlateValidator {
  return {
    name: ValidatorJs.IS_LICENSE_PLATE,
    validationArgs,
  };
}
