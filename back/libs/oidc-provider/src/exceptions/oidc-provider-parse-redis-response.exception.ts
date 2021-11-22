/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcProviderBaseException } from './oidc-provider-base.exception';

@Description(
  'Les données enregistrées dans la session utilisateurs sont corrompues, il faut recommencer la cinématique. Si le problème persiste, contacter le support N3',
)
export class OidcProviderParseRedisResponseException extends OidcProviderBaseException {
  public readonly code = ErrorCode.PARSE_REDIS_RESPONSE;

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
