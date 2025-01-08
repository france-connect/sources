import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

export class RnippNotFoundNoEchoException extends RnippBaseException {
  static CODE = ErrorCode.NOT_FOUND_NO_ECHO;
  static DOCUMENTATION = "Le RNIPP n'a pas trouvé l'identité fournie";
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static HTTP_STATUS_CODE = HttpStatus.FORBIDDEN;
  static UI = 'Rnipp.exceptions.rnippNotFoundNoEcho';
}
