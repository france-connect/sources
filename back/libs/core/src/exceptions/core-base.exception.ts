/* istanbul ignore file */

// Declarative code
import { FcException } from '@fc/exceptions';

export class CoreBaseException extends FcException {
  scope = 0;
}
