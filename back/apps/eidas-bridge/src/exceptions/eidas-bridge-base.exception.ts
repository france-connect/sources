/* istanbul ignore file */

// Declarative code
import { FcException } from '@fc/exceptions/exceptions';

export class EidasBridgeBaseException extends FcException {
  static SCOPE = 5;
}
