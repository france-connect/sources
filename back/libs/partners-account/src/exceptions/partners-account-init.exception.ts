import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { PartnersAccountBaseException } from './partners-account-base.exception';

export class PartnersAccountInitException extends PartnersAccountBaseException {
  static CODE = ErrorCode.ACCOUNT_INIT;
  static HTTP_STATUS_CODE: HttpStatus.INTERNAL_SERVER_ERROR;
  static UI = 'PartnersAccount.exceptions.PartnersAccountInit';
}
