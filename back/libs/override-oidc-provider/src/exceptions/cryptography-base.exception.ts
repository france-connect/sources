/* istanbul ignore file */

// Declarative code
import { FcException } from '@fc/exceptions-deprecated';

export class CryptographyBaseException extends FcException {
  public originalError: Error;
  public readonly scope = 16;
}
