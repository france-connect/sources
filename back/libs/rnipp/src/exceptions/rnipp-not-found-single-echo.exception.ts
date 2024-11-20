/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

export class RnippNotFoundSingleEchoException extends RnippBaseException {
  static CODE = ErrorCode.NOT_FOUND_SINGLE_ECHO;
  static DOCUMENTATION =
    "Le RNIPP a trouvé un echo mais pas suffisamment proche de l'identité demandée";
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static HTTP_STATUS_CODE = HttpStatus.FORBIDDEN;
  static UI = 'Rnipp.exceptions.rnippNotFoundSingleEcho';
}
