/* istanbul ignore file */

// declarative code
import { FcException } from '@fc/exceptions/exceptions';

export class EidasClientBaseException extends FcException {
  static SCOPE = 6;
}
