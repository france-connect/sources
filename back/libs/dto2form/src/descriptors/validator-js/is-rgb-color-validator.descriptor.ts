import { ValidatorJs } from '../../enums';
import { IsRgbColorValidator } from '../../interfaces';

export function $IsRgbColor(
  ...validationArgs: IsRgbColorValidator['validationArgs']
): IsRgbColorValidator {
  return {
    name: ValidatorJs.IS_RGB_COLOR,
    validationArgs,
  };
}
