/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { RnippBaseException } from './';

export class RnippHttpStatusException extends RnippBaseException {
  static CODE = ErrorCode.HTTP_STATUS;
  static DOCUMENTATION =
    "Impossible de joindre le RNIPP. L'utilisateur doit redémarrer sa cinématique. Si cela persiste, contacter le support N3";
  static ERROR = 'temporarily_unavailable';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.GATEWAY_TIMEOUT;
  static UI = 'Rnipp.exceptions.rnippHttpStatus';
}
