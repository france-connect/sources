import { ErrorCode } from '../enums';
import { HttpOtrsClientBaseException } from './http-otrs-client-base.exception';

export class HttpOtrsClientUpdateTicketFailedException extends HttpOtrsClientBaseException {
  static CODE = ErrorCode.UPDATE_TICKET_FAILED;
  static DOCUMENTATION =
    'OTRS ticket update failed (invalid session, ticket not found or server error).';
}
