/* istanbul ignore file */

// Declarative code
import { FcException } from '@fc/exceptions-deprecated';

export class OidcClientBaseException extends FcException {
  public readonly scope = 2;
}
