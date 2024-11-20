/* istanbul ignore file */

// Declarative file
import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

export class CanNotDecodeProtectedHeaderException extends JwtBaseException {
  static CODE = ErrorCode.CAN_NOT_DECODE_PROTECTED_HEADER;
  static DOCUMENTATION = 'Impossible de décoder les entêtes protégées du JWT';
  static UI = 'Jwt.exceptions.canNotDecodeProtectedHeader';
}
