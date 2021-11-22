/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcClientBaseException } from './oidc-client-base.exception';

@Description(
  'Une erreur technique dans le protocole OpenId Connect, contacter le support N3',
)
export class OidcClientRuntimeException extends OidcClientBaseException {
  code = ErrorCode.RUNTIME;

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
