/* istanbul ignore file */

// Declarative file
import { FcException } from '@fc/exceptions/exceptions';

export class JwtBaseException extends FcException {
  static SCOPE = 44;
}
