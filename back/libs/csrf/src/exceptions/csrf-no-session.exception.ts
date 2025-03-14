import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CsrfBaseException } from './csrf-base.exception';

export class CsrfNoSessionException extends CsrfBaseException {
  static CODE = ErrorCode.NO_SESSION;
  static DOCUMENTATION =
    'Pas de session CSRF détectée. Si le problème persiste, contacter le support N3';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Csrf.exceptions.csrfNoSession';
  static HTTP_STATUS_CODE = HttpStatus.UNAUTHORIZED;
}
