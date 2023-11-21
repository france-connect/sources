/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

@Description(
  `Une valeur (id de FI) non autorisée a été passée dans idp_hint. Les FI doivent être explicitement autorisés en configuration, contacter support N3`,
)
export class CoreIdpHintException extends CoreBaseException {
  scope = 3;
  code = ErrorCode.INVALID_IDP_HINT;
  redirect = true;
  oidc = {
    error: 'invalid_idp_hint',
    description: 'An idp_hint was provided but is not allowed',
  };

  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous',
    );
  }
}
