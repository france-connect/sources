import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { DcqlBaseException } from './dcql-base.exception';

export class DcqlInvalidMdocPathException extends DcqlBaseException {
  static CODE = ErrorCode.INVALID_MDOC_PATH;
  static DOCUMENTATION =
    'A mdoc JSONPath from the OpenID4VP config cannot be converted to a DCQL claims path pointer.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'Unsupported mdoc JSONPath';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
}
