/* istanbul ignore file */

// Declarative code
import { FcException } from '@fc/exceptions';

export class AccessControlBaseException extends FcException {
  scope = 21;
}
