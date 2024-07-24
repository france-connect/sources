/* istanbul ignore file */

// Declarative file
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { DeviceBaseException } from './device-base.exception';

@Description(
  'Le cookie "device" contient des données mal formatées, indiquer de vider les cookies et prévenir SN3 situation anormale',
)
export class DeviceCookieInvalidJsonException extends DeviceBaseException {
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;
  public readonly code = ErrorCode.COOKIE_INVALID_JSON;

  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'required parameter missing or invalid';
}
