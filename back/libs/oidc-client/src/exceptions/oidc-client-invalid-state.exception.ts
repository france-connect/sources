/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

@Description(
  "La requête reçue au retour du FI n'est pas valide (state invalide), recommencer la cinématique depuis le FS. si le problème persiste, contacter le support N3",
)
export class OidcClientInvalidStateException extends OidcClientBaseException {
  code = ErrorCode.INVALID_STATE;

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
