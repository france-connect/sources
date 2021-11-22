/* istanbul ignore file */

// declarative code
import { FcException } from '@fc/exceptions';

export class EidasClientBaseException extends FcException {
  public readonly scope = 6;
}
