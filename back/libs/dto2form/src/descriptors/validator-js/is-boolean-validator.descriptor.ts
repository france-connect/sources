/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsBooleanValidator } from '../../interfaces';

export function $IsBoolean(
  ...validationArgs: IsBooleanValidator['validationArgs']
): IsBooleanValidator {
  return {
    name: ValidatorJs.IS_BOOLEAN,
    validationArgs,
  };
}
