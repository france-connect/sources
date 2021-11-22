/* istanbul ignore file */

// Declarative code
import { CoreBaseException, ErrorCode } from '@fc/core';
import { Description } from '@fc/exceptions';

@Description(
  "La session de l'utilisateur ne contient pas les informations attendes sur l'usager au retour du fournisseur d'identité. L'utilisateur doit redémarrer sa cinématique. Si cela persiste, contacter le support N3",
)
export class CoreFcaInvalidIdentityException extends CoreBaseException {
  code = ErrorCode.INVALID_IDENTITY;

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous',
    );
  }
}
