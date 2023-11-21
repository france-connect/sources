/* istanbul ignore file */

// Declarative code
import { Description, Loggable } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CryptographyBaseException } from './cryptography-base.exception';

@Loggable()
@Description(
  "Une erreur est survenue lors de la vérification d'un mot de passe. Contacter le support N3.",
)
export class PasswordHashFailure extends CryptographyBaseException {
  public readonly code = ErrorCode.PASSWORD_HASH_FAILURE;
  public readonly message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
}
