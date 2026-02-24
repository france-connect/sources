import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { AccessControlBaseException } from './access-control-base.exception';

export class AccessControlUnknownHandlerException extends AccessControlBaseException {
  static DOCUMENTATION =
    'Le gestionnaire de permissions demandé est inconnu (erreur dans le code).';
  static CODE = ErrorCode.UNKNOWN_HANDLER;
  static UI = 'AccessControl.exceptions.AccessControlUnknownHandlerException';
  static HTTP_STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;
}
