/* istanbul ignore file */

// declarative code
import { FcException } from '@fc/exceptions';

export class EidasBaseException extends FcException {
  public readonly scope = 5;
}
