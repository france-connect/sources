import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enum';
import { EidasClientBaseException } from './eidas-client-base.exception';

export class InvalidResponseRelayStateException extends EidasClientBaseException {
  static CODE = ErrorCode.INVALID_RESPONSE_RELAY_STATE;
  static DOCUMENTATION =
    "La réponse eIDAS ne correspond pas à la requête d'origine : le paramètre `RelayState` de la réponse ne correspond pas à celui de la requête. Contacter le support N3.";
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION =
    'Authentication aborted due to invalid "relayState" parameter in the eIDAS response';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'EidasClient.exceptions.invalidResponseRelayState';
}
