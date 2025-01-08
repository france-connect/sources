import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

export class OidcClientIdpDisabledException extends OidcClientBaseException {
  static CODE = ErrorCode.DISABLED_PROVIDER;
  static DOCUMENTATION =
    'Le FI est désactivé, si le problème persiste, contacter le support N3';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;
  static UI = 'OidcClient.exceptions.oidcClientIdpDisabled';
}
