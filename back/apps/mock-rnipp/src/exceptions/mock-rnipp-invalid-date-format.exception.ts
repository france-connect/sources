import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MockRnippBaseException } from './mock-rnipp-base.exception';

export class MockRnippInvalidDateFormatException extends MockRnippBaseException {
  static CODE = ErrorCode.INVALID_DATE_FORMAT;
  static DOCUMENTATION = 'Invalid date format provided.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'The date format is invalid.';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'MockRnipp.exceptions.mockRnippInvalidDateFormat';
}
