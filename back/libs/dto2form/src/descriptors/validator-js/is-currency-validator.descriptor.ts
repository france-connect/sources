/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsCurrencyValidator } from '../../interfaces';

export function $IsCurrency(
  ...validationArgs: IsCurrencyValidator['validationArgs']
): IsCurrencyValidator {
  return {
    name: ValidatorJs.IS_CURRENCY,
    validationArgs,
  };
}
