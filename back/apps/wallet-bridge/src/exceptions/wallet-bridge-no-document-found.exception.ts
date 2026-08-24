import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { WalletBridgeBaseException } from './wallet-bridge-base.exception';

export class WalletBridgeNoDocumentFoundException extends WalletBridgeBaseException {
  static CODE = ErrorCode.NO_DOCUMENT_FOUND;
  static DOCUMENTATION =
    'No document was found in the wallet interaction response.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'no document found';
  static HTTP_STATUS_CODE = HttpStatus.UNPROCESSABLE_ENTITY;
}
