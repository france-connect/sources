import { ValidatorJs } from '../../enums';
import { IsLatLongValidator } from '../../interfaces';

export function $IsLatLong(
  ...validationArgs: IsLatLongValidator['validationArgs']
): IsLatLongValidator {
  return {
    name: ValidatorJs.IS_LAT_LONG,
    validationArgs,
  };
}
