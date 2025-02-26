import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CsrfBaseException } from './csrf-base.exception';

export class CsrfBadTokenException extends CsrfBaseException {
  static CODE = ErrorCode.BAD_CSRF_TOKEN;
  static DOCUMENTATION =
    'le jeton CSRF est invalide. Si le problème persiste, contacter le support N3';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Csrf.exceptions.csrfBadToken';
  static HTTP_STATUS_CODE = HttpStatus.UNAUTHORIZED;
}
