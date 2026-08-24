import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MockWalletBaseException } from './mock-wallet-base.exception';

export class MockWalletClientIdMismatchException extends MockWalletBaseException {
  static CODE = ErrorCode.CLIENT_ID_MISMATCH;
  static DOCUMENTATION =
    'The deep link `client_id` does not match the Request Object `client_id`.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'client_id mismatch';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'MockWallet.exceptions.mockWalletClientIdMismatch';
}
