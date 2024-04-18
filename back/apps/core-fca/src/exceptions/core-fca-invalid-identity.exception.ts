/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { CoreBaseException, ErrorCode } from '@fc/core';
import { Description } from '@fc/exceptions-deprecated';

@Description(
  "La session de l'utilisateur ne contient pas les informations attendes sur l'usager au retour du fournisseur d'identité. L'utilisateur doit redémarrer sa cinématique. Si cela persiste, contacter le support N3",
)
export class CoreFcaInvalidIdentityException extends CoreBaseException {
  code = ErrorCode.INVALID_IDENTITY;
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous',
    );
  }
}
