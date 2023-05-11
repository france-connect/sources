/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcProviderBaseException } from './oidc-provider-base.exception';

@Description(
  "Le client id associé à ce fournisseur de service n'a pas été trouvé dans le contexte. Si le problème persiste, contacter le support N3",
)
export class OidcProviderSpIdNotFoundException extends OidcProviderBaseException {
  public readonly code = ErrorCode.SP_ID_NOT_FOUND;
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
