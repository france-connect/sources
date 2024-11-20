/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

export class RnippCitizenStatusFormatException extends RnippBaseException {
  static CODE = ErrorCode.CITIZEN_STATUS_FORMAT;
  static DOCUMENTATION =
    "Erreur technique lors de l'appel RNIPP, contacter le support N3";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'Rnipp.exceptions.rnippCititizenStatusFormat';
}
