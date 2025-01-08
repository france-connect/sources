import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CryptographyBaseException } from './cryptography-base.exception';

export class CryptographyInvalidPayloadFormatException extends CryptographyBaseException {
  static CODE = ErrorCode.INVALID_PAYLOAD_FORMAT;
  static DOCUMENTATION =
    "Il y a un problème dans le format du payload à signer (on attend du Uint8Array, on reçoit autre chose). L'application est inutilisable pour tous les usagers. Contacter le support N3 en urgence.";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI =
    'OverrideOidcProvider.exceptions.cryptographyInvalidPayloadFormat';
}
