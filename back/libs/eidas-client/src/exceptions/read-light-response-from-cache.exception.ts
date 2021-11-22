/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enum';
import { EidasClientBaseException } from './eidas-client-base.exception';

@Description(
  "Il y a un problème de connexion entre le bridge eIDAS et le noeud eIDAS. Il est impossible de récupérer la 'LightResponse' dans le cache ApacheIgnite. L'id est invalide, la réponse a expiré ou le cache est injoignable. Contacter le support N3",
)
export class ReadLightResponseFromCacheException extends EidasClientBaseException {
  public readonly code = ErrorCode.READ_LIGHT_RESPONSE_FROM_CACHE;

  constructor() {
    super('Une erreur technique est survenue, veuillez contacter le support.');
  }
}
