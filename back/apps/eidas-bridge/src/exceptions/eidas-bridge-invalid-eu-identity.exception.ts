/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '@fc/core';

import { EidasBridgeBaseException } from './eidas-bridge-base.exception';

export class EidasBridgeInvalidEUIdentityException extends EidasBridgeBaseException {
  static CODE = ErrorCode.INVALID_IDENTITY;
  static DOCUMENTATION =
    "L'identité reçue du bridge eIDAS ( venant d'un autre état membre ) n'est pas valide. Contacter le support N3";
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static UI = 'EidasBridge.exceptions.eidasBridgeInvalidEuIdentity';
}
