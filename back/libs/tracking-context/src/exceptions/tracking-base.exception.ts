/* istanbul ignore file */

// declarative code
import { FcException } from '@fc/exceptions';

export class TrackingBaseException extends FcException {
  public readonly scope = 41;
}
