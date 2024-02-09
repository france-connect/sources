/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { ChecktokenBaseException } from './checktoken-base.exception';

@Description(
  "Un problème est survenu lors de l'appel au checktoken, le core est injoignable",
)
export class ChecktokenTimeoutException extends ChecktokenBaseException {
  public readonly code = ErrorCode.CHECKTOKEN_TIMEOUT_EXCEPTION;
  public readonly httpStatusCode = HttpStatus.REQUEST_TIMEOUT;
  public readonly error = 'temporary_unavailable';
  message =
    'The authorization server is currently unable to handle the request.';

  static ERROR = 'temporarily_unavailable';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
