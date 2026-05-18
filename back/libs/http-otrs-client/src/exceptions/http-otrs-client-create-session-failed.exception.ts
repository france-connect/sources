import { ErrorCode } from '../enums';
import { HttpOtrsClientBaseException } from './http-otrs-client-base.exception';

export class HttpOtrsClientCreateSessionFailedException extends HttpOtrsClientBaseException {
  static CODE = ErrorCode.CREATE_SESSION_FAILED;
  static DOCUMENTATION =
    'OTRS session creation failed (invalid credentials or server error).';
}
