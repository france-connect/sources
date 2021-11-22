/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enum';
import { EidasClientBaseException } from './eidas-client-base.exception';

@Description(
  "Il y a un problème de connexion entre le bridge eIDAS et le noeud eIDAS. Il est impossible d'écrire la 'LightRequest' dans le cache ApacheIgnite. Le cache est probablement injoignable. Contacter le support N3",
)
export class WriteLightRequestInCacheException extends EidasClientBaseException {
  public readonly code = ErrorCode.WRITE_LIGHT_REQUEST_IN_CACHE;

  constructor() {
    super('Une erreur technique est survenue, veuillez contacter le support');
  }
}
