import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { DeviceBaseException } from './device-base.exception';

export class DeviceCookieInvalidJsonException extends DeviceBaseException {
  static CODE = ErrorCode.COOKIE_INVALID_JSON;
  static DOCUMENTATION =
    'Le cookie "device" contient des données mal formatées, indiquer de vider les cookies et prévenir SN3 situation anormale';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'required parameter missing or invalid';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
}
