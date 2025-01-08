import { FcException } from '@fc/exceptions/exceptions';

export class OidcClientBaseException extends FcException {
  static SCOPE = 2;
}
