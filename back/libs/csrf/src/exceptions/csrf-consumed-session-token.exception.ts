import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CsrfBaseException } from './csrf-base.exception';

export class CsrfConsumedSessionTokenException extends CsrfBaseException {
  static CODE = ErrorCode.CONSUMED_CSRF_TOKEN;
  static DOCUMENTATION =
    'le jeton CSRF a déjà été consommé. Si le problème persiste, contacter le support N3';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Csrf.exceptions.csrfConsumedSessionToken';
  static HTTP_STATUS_CODE = HttpStatus.UNAUTHORIZED;
}
