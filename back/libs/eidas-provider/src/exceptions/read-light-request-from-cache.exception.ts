import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { EidasProviderBaseException } from './eidas-provider-base.exception';

export class ReadLightRequestFromCacheException extends EidasProviderBaseException {
  static CODE = ErrorCode.READ_LIGHT_REQUEST_FROM_CACHE;
  static DOCUMENTATION =
    "Il y a un problème de connexion entre le bridge eIDAS et le noeud eIDAS. Il est impossible de récupérer la 'LightRequest' dans le cache ApacheIgnite. L'id est invalide, la réponse a expiré ou le cache est injoignable. Contacter le support N3";
  static ERROR = 'temporarily_unavailable';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.GATEWAY_TIMEOUT;
  static UI = 'EidasProvider.exceptions.readLightRequestFromCache';
}
