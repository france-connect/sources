import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

export class CoreClaimAmrException extends CoreBaseException {
  static CODE = ErrorCode.CLAIM_AMR;
  static DOCUMENTATION = `Le claim AMR demandé n'est pas autorisé pour le service provider.`;
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'Core.exceptions.coreClaimAmr';
}
