import { ValidatorJs } from '../../enums';
import { IsISO8601Validator } from '../../interfaces';

export function $IsISO8601(
  ...validationArgs: IsISO8601Validator['validationArgs']
): IsISO8601Validator {
  return {
    name: ValidatorJs.IS_ISO8601,
    validationArgs,
  };
}
