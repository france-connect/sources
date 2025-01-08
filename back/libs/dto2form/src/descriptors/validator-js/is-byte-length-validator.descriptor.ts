import { ValidatorJs } from '../../enums';
import { IsByteLengthValidator } from '../../interfaces';

export function $IsByteLength(
  ...validationArgs: IsByteLengthValidator['validationArgs']
): IsByteLengthValidator {
  return {
    name: ValidatorJs.IS_BYTE_LENGTH,
    validationArgs,
  };
}
