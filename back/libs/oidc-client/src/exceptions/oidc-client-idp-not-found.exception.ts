/* istanbul ignore file */

// Declarative code

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

export class OidcClientIdpNotFoundException extends OidcClientBaseException {
  static CODE = ErrorCode.MISSING_PROVIDER;
  static DOCUMENTATION =
    "Le FI n'existe pas, si le problème persiste, contacter le support N3";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'OidcClient.exceptions.oidcClientIdpNotFound';
}
