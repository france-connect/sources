import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MockWalletBaseException } from './mock-wallet-base.exception';

export class MockWalletMdocBuildException extends MockWalletBaseException {
  static CODE = ErrorCode.MDOC_BUILD;
  static DOCUMENTATION = 'The MDOC could not be built.';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION = 'failed to build the MDOC';
  static HTTP_STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;
  static UI = 'MockWallet.exceptions.mockWalletMdocBuild';
}
