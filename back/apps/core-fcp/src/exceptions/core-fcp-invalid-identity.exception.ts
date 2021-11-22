/* istanbul ignore file */

// Declarative code
import { CoreBaseException, ErrorCode } from '@fc/core';
import { Description } from '@fc/exceptions';
/**
 * @todo do not extend class from @fc/core, use a specific BaseException instead
 * This might be done while removing @fc/core altogether in favor of a light code duplication
 * between core-fcp and core-fca.
 */

@Description(
  "La session de l'utilisateur ne contient pas les informations attendes sur l'usager au retour du fournisseur d'identité. L'utilisateur doit redémarrer sa cinématique. Si cela persiste, contacter le support N3",
)
export class CoreFcpInvalidIdentityException extends CoreBaseException {
  code = ErrorCode.INVALID_IDENTITY;
  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous',
    );
  }
}
