/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsCreditCardValidator } from '../../interfaces';

export function $IsCreditCard(
  ...validationArgs: IsCreditCardValidator['validationArgs']
): IsCreditCardValidator {
  return {
    name: ValidatorJs.IS_CREDIT_CARD,
    validationArgs,
  };
}
