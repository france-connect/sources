import { AxiosError } from 'axios';

import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { ChecktokenBaseException } from './checktoken-base.exception';

export class ChecktokenHttpStatusException extends ChecktokenBaseException {
  static CODE = ErrorCode.CHECKTOKEN_HTTP_STATUS_EXCEPTION;
  static DOCUMENTATION =
    "Impossible de joindre le core. L'utilisateur doit redémarrer sa cinématique. Si cela persiste, contacter le support N3";

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
  static UI: string = 'DataProviderAdapterCore.exceptions.checktokenHttpStatus';

  /**
   * @todo FC-2184 ⚠️
   */
  // eslint-disable-next-line complexity
  constructor(error: AxiosError<{ error: string; error_description: string }>) {
    super(error);
    const { status, data } = error?.response || {};
    if (data?.error && data?.error_description) {
      this.log = `status: ${status}, error: ${data.error}, error_description: ${data.error_description}`;
    }
  }
}
