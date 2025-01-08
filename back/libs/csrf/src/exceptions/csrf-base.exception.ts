import { FcException } from '@fc/exceptions/exceptions';

export class CsrfBaseException extends FcException {
  static SCOPE = 47;
}
