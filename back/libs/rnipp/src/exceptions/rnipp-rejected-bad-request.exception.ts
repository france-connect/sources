import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

export class RnippRejectedBadRequestException extends RnippBaseException {
  static CODE = ErrorCode.REJECTED_BAD_REQUEST;
  static DOCUMENTATION =
    "Erreur de communication avec le RNIPP (demande rejetée par le RNIPP). L'utilisateur doit redémarrer sa cinématique. Si cela persiste, contacter le support N3";
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static HTTP_STATUS_CODE = HttpStatus.FORBIDDEN;
  static UI = 'Rnipp.exceptions.rnippRejectedBadRequest';
}
