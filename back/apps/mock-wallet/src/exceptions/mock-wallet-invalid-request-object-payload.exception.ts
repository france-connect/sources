import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MockWalletBaseException } from './mock-wallet-base.exception';

export class MockWalletInvalidRequestObjectPayloadException extends MockWalletBaseException {
  static CODE = ErrorCode.INVALID_REQUEST_OBJECT_PAYLOAD;
  static DOCUMENTATION =
    'The Request Object payload is invalid (claim missing, unsupported value or expired).';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'invalid Request Object payload';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI =
    'MockWallet.exceptions.mockWalletInvalidRequestObjectPayloadException';
}
