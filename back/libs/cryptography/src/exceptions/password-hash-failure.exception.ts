/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { CryptographyBaseException } from './cryptography-base.exception';

@Description(
  "Une erreur est survenue lors de la vérification d'un mot de passe. Contacter le support N3.",
)
export class PasswordHashFailure extends CryptographyBaseException {
  public readonly code = ErrorCode.PASSWORD_HASH_FAILURE;
  public readonly message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
