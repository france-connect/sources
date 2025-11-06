import { FcException } from '@fc/exceptions';

export class TypeormBaseException extends FcException {
  static readonly SCOPE = 63;
}
