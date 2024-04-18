/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

@Description(
  "Le FI n'existe pas, si le problème persiste, contacter le support N3",
)
export class OidcClientIdpNotFoundException extends OidcClientBaseException {
  code = ErrorCode.MISSING_PROVIDER;
  message =
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
