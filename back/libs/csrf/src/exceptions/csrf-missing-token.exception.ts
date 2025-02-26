import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CsrfBaseException } from './csrf-base.exception';

export class CsrfMissingTokenException extends CsrfBaseException {
  static CODE = ErrorCode.MISSING_CSRF_TOKEN;
  static DOCUMENTATION =
    "le jeton CSRF n'a pas été envoyé. Si le problème persiste, contacter le support N3";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Csrf.exceptions.csrfMissingToken';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
}
