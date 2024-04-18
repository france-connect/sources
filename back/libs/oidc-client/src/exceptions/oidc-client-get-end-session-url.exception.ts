/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

@Description(
  "Impossible de récupérer l'url de déconnexion du FI, probablement dû à une erreur de configuration du FI. Contacter le support N3",
)
export class OidcClientGetEndSessionUrlException extends OidcClientBaseException {
  code = ErrorCode.GET_END_SESSION_URL;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
