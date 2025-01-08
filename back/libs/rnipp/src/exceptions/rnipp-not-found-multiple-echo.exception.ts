import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

export class RnippNotFoundMultipleEchoException extends RnippBaseException {
  static CODE = ErrorCode.NOT_FOUND_MULTIPLE_ECHO;
  static DOCUMENTATION =
    "Le RNIPP a trouvé plusieurs echos pour l'identité fournie";
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static HTTP_STATUS_CODE = HttpStatus.FORBIDDEN;
  static UI = 'Rnipp.exceptions.rnippNotFoundMultipleEcho';
}
