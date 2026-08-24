import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { WalletBridgeBaseException } from './wallet-bridge-base.exception';

export class WalletBridgeMultipleDocumentsFoundException extends WalletBridgeBaseException {
  static CODE = ErrorCode.MULTIPLE_DOCUMENTS_FOUND;
  static DOCUMENTATION =
    'More than one document was found in the wallet interaction response.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'multiple documents found';
  static HTTP_STATUS_CODE = HttpStatus.UNPROCESSABLE_ENTITY;
}
