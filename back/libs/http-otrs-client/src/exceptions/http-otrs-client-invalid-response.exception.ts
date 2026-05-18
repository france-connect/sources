import { ErrorCode } from '../enums';
import { HttpOtrsClientBaseException } from './http-otrs-client-base.exception';

export class HttpOtrsClientInvalidResponseException extends HttpOtrsClientBaseException {
  static CODE = ErrorCode.INVALID_RESPONSE;
  static DOCUMENTATION =
    'OTRS response does not match the expected DTO structure.';
}
