import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MdocBaseException } from './mdoc-base.exception';

export class MdocValidityWindowException extends MdocBaseException {
  static CODE = ErrorCode.VALIDITY_WINDOW;
  static DOCUMENTATION =
    'The mdoc has an inconsistent validity window: `validFrom` is later than `validUntil`.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'mdoc validity window is inconsistent';
  static HTTP_STATUS_CODE = HttpStatus.UNAUTHORIZED;
}
