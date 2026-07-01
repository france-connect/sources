import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MdocBaseException } from './mdoc-base.exception';

export class MdocSignatureException extends MdocBaseException {
  static CODE = ErrorCode.SIGNATURE;
  static DOCUMENTATION =
    'The mdoc signature or COSE algorithm is not acceptable.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'mdoc signature check failed';
  static HTTP_STATUS_CODE = HttpStatus.UNAUTHORIZED;
}
