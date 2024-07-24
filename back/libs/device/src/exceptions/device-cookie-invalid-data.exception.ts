/* istanbul ignore file */

// Declarative file
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { DeviceBaseException } from './device-base.exception';

@Description(
  'Le cookie "device" contient des données invalides, indiquer de vider les cookies et prévenir SN3 situation anormale',
)
export class DeviceCookieInvalidDataException extends DeviceBaseException {
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;
  public readonly code = ErrorCode.COOKIE_INVALID_DATA;

  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'required parameter missing or invalid';
}
