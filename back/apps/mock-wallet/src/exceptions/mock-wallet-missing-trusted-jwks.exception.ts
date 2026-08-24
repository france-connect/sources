import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MockWalletBaseException } from './mock-wallet-base.exception';

export class MockWalletMissingTrustedJwksException extends MockWalletBaseException {
  static CODE = ErrorCode.MISSING_TRUSTED_JWKS;
  static DOCUMENTATION =
    'Signature verification is enabled but no trusted JWKS is configured.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'missing trusted JWKS';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'MockWallet.exceptions.mockWalletMissingTrustedJwks';
}
