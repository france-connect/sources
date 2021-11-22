/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { OidcProviderBaseException } from './oidc-provider-base.exception';

@Description(
  "Une erreur est survenue lors de l'enregistrement de données dans la session de l'utilisateur. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3",
)
export class OidcProviderStringifyPayloadForRedisException extends OidcProviderBaseException {
  public readonly code = ErrorCode.STRINGIFY_FOR_REDIS;

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
