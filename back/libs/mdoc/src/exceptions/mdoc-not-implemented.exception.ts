import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MdocBaseException } from './mdoc-base.exception';

export class MdocNotImplementedException extends MdocBaseException {
  static CODE = ErrorCode.NOT_IMPLEMENTED;
  static DOCUMENTATION =
    'A required mdoc context operation is not implemented in this environment.';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION = 'mdoc operation not implemented';
  static HTTP_STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;

  constructor(feature: string) {
    super(`${feature} is not implemented in the mock mdoc context`);
  }
}
