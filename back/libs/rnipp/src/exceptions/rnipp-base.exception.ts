/* istanbul ignore file */

// Declarative code
import { FcException } from '@fc/exceptions-deprecated';

export class RnippBaseException extends FcException {
  public readonly scope = 1;
}
