/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

@Description(
  "La requête reçue au retour du FI n'est pas valide (le code d'autorisation est présent mais n'est pas reconnu par le FI), recommencer la cinématique depuis le FS. Si le problème persiste, contacter le support N3",
)
export class OidcClientTokenFailedException extends OidcClientBaseException {
  code = ErrorCode.TOKEN_FAILED;

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
