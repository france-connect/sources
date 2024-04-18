/* istanbul ignore file */

// Declarative file
import { FcException } from '@fc/exceptions-deprecated/exceptions';

export class I18nBaseException extends FcException {
  public readonly scope = 49;
}
