/* istanbul ignore file */

// Declarative code
import { FcException } from '@fc/exceptions';

export class CryptographyBaseException extends FcException {
  public originalError: Error;
  public readonly scope = 16;

  constructor(error: any) {
    super();
    if (error) {
      this.originalError = error;
    }

    this.message = error.message;

    if (error.error_description) {
      this.message = `${this.message}\n${error.error_description}`;
    }
  }
}
