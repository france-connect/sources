/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { EidasProviderBaseException } from './eidas-provider-base.exception';

export class WriteLightResponseInCacheException extends EidasProviderBaseException {
  static CODE = ErrorCode.WRITE_LIGHT_RESPONSE_IN_CACHE;
  static DOCUMENTATION =
    "Il y a un problème de connexion entre le bridge eIDAS et le noeud eIDAS. Il est impossible d'écrire la 'LightResponse' dans le cache ApacheIgnite. Le cache est probablement injoignable. Contacter le support N3";
  static ERROR = 'temporarily_unavailable';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.GATEWAY_TIMEOUT;
  static UI = 'EidasProvider.exceptions.writeLightResponseInCache';
}
