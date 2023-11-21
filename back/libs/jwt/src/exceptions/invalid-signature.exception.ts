/* istanbul ignore file */

// Declarative file
import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

export class InvalidSignatureException extends JwtBaseException {
  code = ErrorCode.INVALID_SIGNATURE;
  message = 'Signature not verified';
}
