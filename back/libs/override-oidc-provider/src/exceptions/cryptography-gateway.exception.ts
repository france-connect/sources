import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CryptographyBaseException } from './cryptography-base.exception';

export class CryptographyGatewayException extends CryptographyBaseException {
  static CODE = ErrorCode.GATEWAY;
  static DOCUMENTATION =
    "Il y a un problème de communication avec le HSM. L'application est inutilisable pour tous les usagers. Contacter le support N3 en urgence.";
  static ERROR = 'temporarily_unavailable';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.BAD_GATEWAY;
  static UI = 'OverrideOidcProvider.exceptions.cryptographyGateway';
}
