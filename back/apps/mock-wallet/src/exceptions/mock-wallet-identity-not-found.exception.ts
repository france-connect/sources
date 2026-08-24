import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MockWalletBaseException } from './mock-wallet-base.exception';

export class MockWalletIdentityNotFoundException extends MockWalletBaseException {
  static CODE = ErrorCode.IDENTITY_NOT_FOUND;
  static DOCUMENTATION = 'The requested mock identity index is out of bounds.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'identity index out of bounds';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'MockWallet.exceptions.mockWalletIdentityNotFound';
}
