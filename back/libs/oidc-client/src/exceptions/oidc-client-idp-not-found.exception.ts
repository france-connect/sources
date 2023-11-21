/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

@Description(
  "Le FI n'existe pas, si le problème persiste, contacter le support N3",
)
export class OidcClientIdpNotFoundException extends OidcClientBaseException {
  code = ErrorCode.MISSING_PROVIDER;
  message =
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.';
}
