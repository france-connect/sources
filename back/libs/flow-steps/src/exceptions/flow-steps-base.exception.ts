/* istanbul ignore file */

// Declarative file
import { FcException } from '@fc/exceptions/exceptions';

export class FlowStepsBaseException extends FcException {
  public readonly scope = 42;
}
