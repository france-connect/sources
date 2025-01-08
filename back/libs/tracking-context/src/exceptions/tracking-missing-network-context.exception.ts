import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { TrackingBaseException } from './tracking-base.exception';

export class TrackingMissingNetworkContextException extends TrackingBaseException {
  static CODE = ErrorCode.MISSING_HEADERS;
  static DOCUMENTATION =
    "L'application n'a pas trouvé de headers dans l'objet request, c'est probablement un bug, Contacter le support N3";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'TrackingContext.exceptions.trackingMissingNetworkContext';
}
