import { ValidatorJs } from '../../enums';
import { IsTaxIDValidator } from '../../interfaces';

export function $IsTaxID(
  ...validationArgs: IsTaxIDValidator['validationArgs']
): IsTaxIDValidator {
  return {
    name: ValidatorJs.IS_TAX_ID,
    validationArgs,
  };
}
