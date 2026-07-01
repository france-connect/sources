import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MdocBaseException } from './mdoc-base.exception';

export class MdocDecodeException extends MdocBaseException {
  static CODE = ErrorCode.DECODE;
  static DOCUMENTATION =
    'The submitted mdoc could not be decoded: the CBOR payload is invalid or does not match ISO/IEC 18013-5.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'mdoc decoding failed';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
}
