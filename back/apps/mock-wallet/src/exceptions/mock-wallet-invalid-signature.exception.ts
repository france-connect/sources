import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MockWalletBaseException } from './mock-wallet-base.exception';

export class MockWalletInvalidSignatureException extends MockWalletBaseException {
  static CODE = ErrorCode.INVALID_SIGNATURE;
  static DOCUMENTATION =
    'The Request Object signature could not be verified against the trusted JWKS.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'invalid Request Object signature';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'MockWallet.exceptions.mockWalletInvalidSignature';
}
