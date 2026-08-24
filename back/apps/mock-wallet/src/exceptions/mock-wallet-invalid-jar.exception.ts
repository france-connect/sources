import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MockWalletBaseException } from './mock-wallet-base.exception';

export class MockWalletInvalidJarException extends MockWalletBaseException {
  static CODE = ErrorCode.INVALID_JAR;
  static DOCUMENTATION =
    'The Request Object is not a compact JWS (3 dot-separated segments).';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'Request Object is not a compact JWS';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'MockWallet.exceptions.mockWalletInvalidJar';
}
