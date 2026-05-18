import { ErrorCode } from '../enums';
import { HttpOtrsClientBaseException } from './http-otrs-client-base.exception';

export class HttpOtrsClientHttpFailureException extends HttpOtrsClientBaseException {
  static CODE = ErrorCode.HTTP_FAILURE;
  static DOCUMENTATION = 'OTRS HTTP request failed (network error or timeout).';
}
