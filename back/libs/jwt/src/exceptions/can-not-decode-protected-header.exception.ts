/* istanbul ignore file */

// Declarative file
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

@Description('Impossible de décoder les entêtes protégées du JWT')
export class CanNotDecodeProtectedHeaderException extends JwtBaseException {
  code: ErrorCode.CAN_NOT_DECODE_PROTECTED_HEADER;
  message = 'Can not decode protected header';
}
