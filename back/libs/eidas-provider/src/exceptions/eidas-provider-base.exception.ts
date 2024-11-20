/* istanbul ignore file */

// declarative code
import { FcException } from '@fc/exceptions/exceptions';

export class EidasProviderBaseException extends FcException {
  static SCOPE = 7;
}
