import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

export class OidcClientFailedToFetchBlacklist extends OidcClientBaseException {
  static CODE = ErrorCode.BLACLIST_OR_WHITELIST_CHECK_FAILED;
  static DOCUMENTATION =
    "La liste de fournisseur d'identité autorisés pour ce FS n'a pas pu être récupérée. L'utilisateur doit recommencer sa cinématique. Si le problème persiste, contacter le support N3";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'OidcClient.exceptions.oidcClientIdpFailedToFetchBlacklist';
}
