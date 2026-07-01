import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MdocBaseException } from './mdoc-base.exception';

export class MdocValidityPeriodException extends MdocBaseException {
  static CODE = ErrorCode.VALIDITY_PERIOD;
  static DOCUMENTATION =
    'The mdoc is outside its validity period: current time is before `signed`/`validFrom` or after `validUntil`.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'mdoc is not valid for the current time';
  static HTTP_STATUS_CODE = HttpStatus.UNAUTHORIZED;
}
