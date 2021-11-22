/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

@Description(
  "Impossible de récupérer l'url de déconnexion du FI, probablement dû à une erreur de configuration du FI. Contacter le support N3",
)
export class OidcClientGetEndSessionUrlException extends OidcClientBaseException {
  code = ErrorCode.GET_END_SESSION_URL;

  constructor() {
    super('Une erreur technique est survenue, veuillez contacter le support.');
  }
}
