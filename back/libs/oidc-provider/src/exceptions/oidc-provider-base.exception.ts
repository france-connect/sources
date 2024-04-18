/* istanbul ignore file */

// Declarative code
import { FcException } from '@fc/exceptions-deprecated';

export class OidcProviderBaseException extends FcException {
  public originalError: Error;
  public readonly scope = 3;
}
