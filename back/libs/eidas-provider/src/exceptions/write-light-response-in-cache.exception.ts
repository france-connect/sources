/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { EidasProviderBaseException } from './eidas-provider-base.exception';

@Description(
  "Il y a un problème de connexion entre le bridge eIDAS et le noeud eIDAS. Il est impossible d'écrire la 'LightResponse' dans le cache ApacheIgnite. Le cache est probablement injoignable. Contacter le support N3",
)
export class WriteLightResponseInCacheException extends EidasProviderBaseException {
  public readonly code = ErrorCode.WRITE_LIGHT_RESPONSE_IN_CACHE;

  constructor() {
    super('Une erreur technique est survenue, veuillez contacter le support.');
  }
}
