import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { Openid4vpBaseException } from './openid4vp-base.exception';

export class Openid4vpAuthorizationNotFoundException extends Openid4vpBaseException {
  static CODE = ErrorCode.AUTHORIZATION_NOT_FOUND;
  static DOCUMENTATION =
    'No OID4VP authorization request matches the provided interaction id (unknown or expired).';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'OID4VP authorization request not found';
  static HTTP_STATUS_CODE = HttpStatus.NOT_FOUND;
}
