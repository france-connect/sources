import { ErrorCode } from '../enums';
import { OidcAcrBaseException } from './oidc-acr-base.exception';

export class OidcAcrNoSsoAllowedAcrFoundException extends OidcAcrBaseException {
  static CODE = ErrorCode.NO_SSO_ALLOWED_ACR_FOUND;
  static DOCUMENTATION =
    "Une connexion SSO a échouée car le niveau ACR n'a pas pu être déterminé";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'OidcAcr.exceptions.oidcAcrNoSsoAllowedAcrFound';
}
