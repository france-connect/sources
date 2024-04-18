/* istanbul ignore file */

// Declarative file
import { FcException } from '@fc/exceptions-deprecated/exceptions';

export class FlowStepsBaseException extends FcException {
  public readonly scope = 42;
}
