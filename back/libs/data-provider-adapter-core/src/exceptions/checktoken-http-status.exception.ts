/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { ChecktokenBaseException } from './checktoken-base.exception';

@Description(
  "Impossible de joindre le core. L'utilisateur doit redémarrer sa cinématique. Si cela persiste, contacter le support N3",
)
export class ChecktokenHttpStatusException extends ChecktokenBaseException {
  public readonly code = ErrorCode.CHECKTOKEN_HTTP_STATUS_EXCEPTION;
  public readonly httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  public readonly error = 'server_error';
  message =
    'The authorization server encountered an unexpected condition that prevented it from fulfilling the request.';
}
