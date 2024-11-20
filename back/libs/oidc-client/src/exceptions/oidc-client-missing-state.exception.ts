/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

export class OidcClientMissingStateException extends OidcClientBaseException {
  static CODE = ErrorCode.MISSING_STATE;
  static DOCUMENTATION =
    "La requête reçue au retour du FI n'est pas valide (pas de state), problème probable avec le FI, contacter le support N3";
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'OidcClient.exceptions.oidcClientMissingState';
}
