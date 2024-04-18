/* istanbul ignore file */

// Declarative code
import { FcException } from '@fc/exceptions-deprecated';

export class CoreBaseException extends FcException {
  scope = 0;
}
