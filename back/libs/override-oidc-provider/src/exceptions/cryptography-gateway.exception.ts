/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CryptographyBaseException } from './cryptography-base.exception';

@Description(
  "Il y a un problème de communication avec le HSM. L'application est inutilisable pour tous les usagers. Contacter le support N3 en urgence.",
)
export class CryptographyGatewayException extends CryptographyBaseException {
  public readonly code = ErrorCode.GATEWAY;
  public readonly message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
  public readonly httpStatusCode = HttpStatus.BAD_GATEWAY;

  static ERROR = 'temporarily_unavailable';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
