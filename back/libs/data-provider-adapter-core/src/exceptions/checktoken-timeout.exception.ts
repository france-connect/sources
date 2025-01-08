import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { ChecktokenBaseException } from './checktoken-base.exception';

export class ChecktokenTimeoutException extends ChecktokenBaseException {
  static CODE = ErrorCode.CHECKTOKEN_TIMEOUT_EXCEPTION;
  static DOCUMENTATION =
    "Un problème est survenu lors de l'appel au checktoken, le core est injoignable";
  static ERROR = 'temporarily_unavailable';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.REQUEST_TIMEOUT;
  static UI = 'DataProviderAdapterCore.exceptions.checktokenTimeout';
}
