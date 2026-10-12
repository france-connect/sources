import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { EidasBridgeBaseException } from './eidas-bridge-base.exception';

export class EidasBridgeInvalidNameIdFormatException extends EidasBridgeBaseException {
  static CODE = ErrorCode.INVALID_NAMEID_FORMAT;
  static DOCUMENTATION =
    'Le NameIDFormat reçu du bridge eIDAS ( venant d’un autre état membre ) n’est pas valide. Contacter le support N3.';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static UI = 'EidasBridge.exceptions.eidasBridgeInvalidNameIdFormat';
}
