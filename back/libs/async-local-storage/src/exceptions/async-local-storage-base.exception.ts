/* istanbul ignore file */

// declarative code
import { FcException } from '@fc/exceptions/exceptions/fc.exception';

export class AsyncLocalStorageBaseException extends FcException {
  public readonly scope = 45;
}
