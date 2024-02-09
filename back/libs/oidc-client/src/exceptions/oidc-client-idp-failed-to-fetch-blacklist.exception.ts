/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

@Description(
  "La liste de fournisseur d'identité autorisés pour ce FS n'a pas pu être récupérée. L'utilisateur doit recommencer sa cinématique. Si le problème persiste, contacter le support N3",
)
export class OidcClientFailedToFetchBlacklist extends OidcClientBaseException {
  code = ErrorCode.BLACLIST_OR_WHITELIST_CHECK_FAILED;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
