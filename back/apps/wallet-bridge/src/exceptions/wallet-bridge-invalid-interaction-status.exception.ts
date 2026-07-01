import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { WalletBridgeBaseException } from './wallet-bridge-base.exception';

export class WalletBridgeInvalidInteractionStatusException extends WalletBridgeBaseException {
  static CODE = ErrorCode.INVALID_INTERACTION_STATUS;
  static DOCUMENTATION = 'The interaction status is not valid.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'invalid interaction status';
  static HTTP_STATUS_CODE = HttpStatus.FORBIDDEN;
}
