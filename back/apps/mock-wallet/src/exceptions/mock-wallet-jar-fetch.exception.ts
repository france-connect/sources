import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MockWalletBaseException } from './mock-wallet-base.exception';

export class MockWalletJarFetchException extends MockWalletBaseException {
  static CODE = ErrorCode.JAR_FETCH;
  static DOCUMENTATION =
    'The Request Object could not be fetched, or its content-type is unexpected.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'unexpected Request Object content-type';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'MockWallet.exceptions.mockWalletJarFetch';
}
