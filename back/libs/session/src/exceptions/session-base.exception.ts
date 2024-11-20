/* istanbul ignore file */

// declarative code
import { FcException } from '@fc/exceptions/exceptions';

export class SessionBaseException extends FcException {
  static SCOPE = 19;
}
