/* istanbul ignore file */

// Declarative code
import { FcException } from '@fc/exceptions-deprecated';

export class FeatureHandlerBaseException extends FcException {
  public readonly scope = 20;
}
