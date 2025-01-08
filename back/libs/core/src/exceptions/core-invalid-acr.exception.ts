import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

export class CoreInvalidAcrException extends CoreBaseException {
  static CODE = ErrorCode.INVALID_ACR;
  static DOCUMENTATION = `Le niveau eidas demandé par le FS ou renvoyé par le FI n'est pas supporté par la plateforme`;
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'acr_values ​​not supported';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'Core.exceptions.coreInvalidAcr';
}
