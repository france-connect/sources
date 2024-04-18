/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enum';
import { EidasClientBaseException } from './eidas-client-base.exception';

@Description(
  "Il y a un problème de connexion entre le bridge eIDAS et le noeud eIDAS. Il est impossible d'écrire la 'LightRequest' dans le cache ApacheIgnite. Le cache est probablement injoignable. Contacter le support N3",
)
export class WriteLightRequestInCacheException extends EidasClientBaseException {
  public readonly code = ErrorCode.WRITE_LIGHT_REQUEST_IN_CACHE;
  public readonly message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  public readonly httpStatusCode = HttpStatus.GATEWAY_TIMEOUT;

  static ERROR = 'temporarily_unavailable';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
