import { ErrorCode } from '../enums';
import { HttpOtrsClientBaseException } from './http-otrs-client-base.exception';

export class HttpOtrsClientGetTicketFailedException extends HttpOtrsClientBaseException {
  static CODE = ErrorCode.GET_TICKET_FAILED;
  static DOCUMENTATION =
    'OTRS ticket retrieval failed (ticket not found or server error).';
}
