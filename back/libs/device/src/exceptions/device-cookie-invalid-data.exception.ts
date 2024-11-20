/* istanbul ignore file */

// Declarative file
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { DeviceBaseException } from './device-base.exception';

export class DeviceCookieInvalidDataException extends DeviceBaseException {
  static CODE = ErrorCode.COOKIE_INVALID_DATA;
  static DOCUMENTATION =
    'Le cookie "device" contient des données invalides, indiquer de vider les cookies et prévenir SN3 situation anormale';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'required parameter missing or invalid';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
}
