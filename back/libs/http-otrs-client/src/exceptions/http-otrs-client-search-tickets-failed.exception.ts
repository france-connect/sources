import { ErrorCode } from '../enums';
import { HttpOtrsClientBaseException } from './http-otrs-client-base.exception';

export class HttpOtrsClientSearchTicketsFailedException extends HttpOtrsClientBaseException {
  static CODE = ErrorCode.SEARCH_TICKETS_FAILED;
  static DOCUMENTATION =
    'OTRS ticket search failed (invalid session or server error).';
}
