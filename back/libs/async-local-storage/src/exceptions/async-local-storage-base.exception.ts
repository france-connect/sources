/* istanbul ignore file */

// declarative code
import { FcException } from '@fc/exceptions/exceptions';

export class AsyncLocalStorageBaseException extends FcException {
  static SCOPE = 45;
}
