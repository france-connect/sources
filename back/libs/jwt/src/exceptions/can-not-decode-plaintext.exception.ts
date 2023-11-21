/* istanbul ignore file */

// Declarative file
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

@Description('Impossible de décoder le JWT une fois déchiffré')
export class CanNotDecodePlaintextException extends JwtBaseException {
  code = ErrorCode.CAN_NOT_DECODE_PLAINTEXT;
  message = 'Can not decode plaintext';
}
