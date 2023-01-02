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
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
}
