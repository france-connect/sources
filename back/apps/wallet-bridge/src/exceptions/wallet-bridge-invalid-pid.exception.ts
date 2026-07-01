import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { WalletBridgeBaseException } from './wallet-bridge-base.exception';

export class WalletBridgeInvalidPidException extends WalletBridgeBaseException {
  static CODE = ErrorCode.INVALID_PID_CLAIMS;
  static DOCUMENTATION =
    'The PID claims extracted from the mdoc do not match the expected EUDI PID schema.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'invalid PID claims';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
}
