/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { EidasProviderBaseException } from './eidas-provider-base.exception';

@Description(
  "Il y a un problème de connexion entre le bridge eIDAS et le noeud eIDAS. Il est impossible de récupérer la 'LightRequest' dans le cache ApacheIgnite. L'id est invalide, la réponse a expiré ou le cache est injoignable. Contacter le support N3",
)
export class ReadLightRequestFromCacheException extends EidasProviderBaseException {
  public readonly code = ErrorCode.READ_LIGHT_REQUEST_FROM_CACHE;
  public readonly message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  public readonly httpStatusCode = HttpStatus.GATEWAY_TIMEOUT;

  static ERROR = 'temporarily_unavailable';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
