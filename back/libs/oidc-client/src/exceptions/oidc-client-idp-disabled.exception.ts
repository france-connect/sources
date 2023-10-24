/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

@Description(
  'Le FI est désactivé, si le problème persiste, contacter le support N3',
)
export class OidcClientIdpDisabledException extends OidcClientBaseException {
  code = ErrorCode.DISABLED_PROVIDER;
  message =
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.';
  // should not happen as we display only valid identity providers on user's ip choice page
  public readonly httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
}
