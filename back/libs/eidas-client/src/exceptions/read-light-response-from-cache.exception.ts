/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enum';
import { EidasClientBaseException } from './eidas-client-base.exception';

export class ReadLightResponseFromCacheException extends EidasClientBaseException {
  static CODE = ErrorCode.READ_LIGHT_RESPONSE_FROM_CACHE;
  static DOCUMENTATION =
    "Il y a un problème de connexion entre le bridge eIDAS et le noeud eIDAS. Il est impossible de récupérer la 'LightResponse' dans le cache ApacheIgnite. L'id est invalide, la réponse a expiré ou le cache est injoignable. Contacter le support N3";
  static ERROR = 'temporarily_unavailable';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.GATEWAY_TIMEOUT;
  static UI = 'EidasClient.exceptions.readLightResponseFromCache';
}
