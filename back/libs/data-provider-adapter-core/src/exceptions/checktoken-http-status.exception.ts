/* istanbul ignore file */

// Declarative code
import { AxiosError } from 'axios';

import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { ChecktokenBaseException } from './checktoken-base.exception';

@Description(
  "Impossible de joindre le core. L'utilisateur doit redémarrer sa cinématique. Si cela persiste, contacter le support N3",
)
export class ChecktokenHttpStatusException extends ChecktokenBaseException {
  public readonly code = ErrorCode.CHECKTOKEN_HTTP_STATUS_EXCEPTION;
  public readonly httpStatusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
  public readonly error: string = 'server_error';
  public readonly message: string =
    'The authorization server encountered an unexpected condition that prevented it from fulfilling the request.';

  // eslint-disable-next-line @typescript-eslint/naming-convention
  constructor(error: AxiosError<{ error: string; error_description: string }>) {
    super(error);

    const { status, data } = error?.response || {};
    if (data?.error && data?.error_description) {
      this.httpStatusCode = status;
      this.error = data.error;
      this.message = data.error_description;
    }
  }
}
