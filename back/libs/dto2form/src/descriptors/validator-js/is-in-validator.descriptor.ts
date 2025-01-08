import { ValidatorJs } from '../../enums';
import { IsInValidator } from '../../interfaces';

export function $IsIn(
  ...validationArgs: IsInValidator['validationArgs']
): IsInValidator {
  return { name: ValidatorJs.IS_IN, validationArgs };
}
