import { ErrorCode } from '../enums';
import { OidcProviderBaseRedirectException } from './oidc-provider-base-redirect.exception';

export class OidcProviderUserAbortedException extends OidcProviderBaseRedirectException {
  static CODE = ErrorCode.USER_ABORTED;
  static DOCUMENTATION =
    "L'usager a annulé l'authentification (lien de retour vers le FS)";
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static UI = 'OidcProvider.exceptions.OidcProviderUserAborted';
}
