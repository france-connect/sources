/* istanbul ignore file */

// declarative code
import { FcException } from '@fc/exceptions/exceptions';

export class TrackingBaseException extends FcException {
  static SCOPE = 41;
}
