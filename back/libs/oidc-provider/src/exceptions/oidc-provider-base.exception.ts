/* istanbul ignore file */

// Declarative code
import { FcException } from '@fc/exceptions';

export class OidcProviderBaseException extends FcException {
  public originalError: Error;
  public readonly scope = 3;
}
