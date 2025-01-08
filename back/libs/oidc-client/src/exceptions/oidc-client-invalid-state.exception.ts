import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

export class OidcClientInvalidStateException extends OidcClientBaseException {
  static CODE = ErrorCode.INVALID_STATE;
  static DOCUMENTATION =
    "La requête reçue au retour du FI n'est pas valide (state invalide), recommencer la cinématique depuis le FS. si le problème persiste, contacter le support N3";
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'invalid state parameter';
  static HTTP_STATUS_CODE = HttpStatus.FORBIDDEN;
  static UI = 'OidcClient.exceptions.oidcClientInvalidState';
}
