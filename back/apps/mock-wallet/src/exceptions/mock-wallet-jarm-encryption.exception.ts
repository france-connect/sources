import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MockWalletBaseException } from './mock-wallet-base.exception';

export class MockWalletJarmEncryptionException extends MockWalletBaseException {
  static CODE = ErrorCode.JARM_ENCRYPTION;
  static DOCUMENTATION = 'The JARM encrypted response could not be built.';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION = 'failed to build the JARM response';
  static HTTP_STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;
  static UI = 'MockWallet.exceptions.mockWalletJarmEncryption';
}
