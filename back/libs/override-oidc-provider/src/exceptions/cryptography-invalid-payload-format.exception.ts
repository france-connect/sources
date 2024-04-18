/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { CryptographyBaseException } from './cryptography-base.exception';

@Description(
  "Il y a un problème dans le format du payload à signer (on attend du Uint8Array, on reçoit autre chose). L'application est inutilisable pour tous les usagers. Contacter le support N3 en urgence.",
)
export class CryptographyInvalidPayloadFormatException extends CryptographyBaseException {
  public readonly code = ErrorCode.INVALID_PAYLOAD_FORMAT;
  public readonly message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
