import { ValidatorJs } from '../../enums';
import { IsIdentityCardValidator } from '../../interfaces';

export function $IsIdentityCard(
  ...validationArgs: IsIdentityCardValidator['validationArgs']
): IsIdentityCardValidator {
  return {
    name: ValidatorJs.IS_IDENTITY_CARD,
    validationArgs,
  };
}
