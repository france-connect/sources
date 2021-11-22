/* istanbul ignore file */

// declarative code
import { FcException } from '@fc/exceptions';

export class EidasProviderBaseException extends FcException {
  public readonly scope = 7;
}
