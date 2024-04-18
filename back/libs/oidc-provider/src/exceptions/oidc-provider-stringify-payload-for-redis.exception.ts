/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { OidcProviderBaseException } from './oidc-provider-base.exception';

@Description(
  "Une erreur est survenue lors de l'enregistrement de données dans la session de l'utilisateur. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3",
)
export class OidcProviderStringifyPayloadForRedisException extends OidcProviderBaseException {
  public readonly code = ErrorCode.STRINGIFY_FOR_REDIS;
  public readonly message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
