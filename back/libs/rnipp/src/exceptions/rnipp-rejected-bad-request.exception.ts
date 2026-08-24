import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

export class RnippRejectedBadRequestException extends RnippBaseException {
  static CODE = ErrorCode.REJECTED_BAD_REQUEST;
  static DOCUMENTATION =
    'Erreur de syntaxe dans l’identité envoyée au RNIPP (demande rejetée par le RNIPP). Contacter le support pour faire corriger l’identité auprès du FI';
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static HTTP_STATUS_CODE = HttpStatus.FORBIDDEN;
  static UI = 'Rnipp.exceptions.rnippRejectedBadRequest';
}
