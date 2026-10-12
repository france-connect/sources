import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { Openid4vpBaseException } from './openid4vp-base.exception';

export class Openid4vpInvalidVpTokenException extends Openid4vpBaseException {
  static CODE = ErrorCode.INVALID_VP_TOKEN;
  static DOCUMENTATION =
    'The OID4VP authorization response does not contain a valid `vp_token`: expected a string or a DCQL object keyed by credential query id.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'OID4VP vp_token is missing or invalid';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
}
