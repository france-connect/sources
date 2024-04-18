/* istanbul ignore file */

// declarative code
import { FcException } from '@fc/exceptions-deprecated';

export class EidasProviderBaseException extends FcException {
  public readonly scope = 7;
}
