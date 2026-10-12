import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { DcqlBaseException } from './dcql-base.exception';

export class DcqlInvalidQueryException extends DcqlBaseException {
  static CODE = ErrorCode.INVALID_QUERY;
  static DOCUMENTATION =
    'The DCQL query is structurally invalid or fails content validation.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'DCQL query is invalid';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
}
