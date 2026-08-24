import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MockWalletBaseException } from './mock-wallet-base.exception';

export class MockWalletInvalidRequestObjectHeaderException extends MockWalletBaseException {
  static CODE = ErrorCode.INVALID_REQUEST_OBJECT_HEADER;
  static DOCUMENTATION =
    'The Request Object header is invalid: unexpected `typ` or disallowed `alg`.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'invalid Request Object header';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI =
    'MockWallet.exceptions.mockWalletInvalidRequestObjectHeaderException';
}
