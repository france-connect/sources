import { FcException } from '@fc/exceptions';

export class RedisBaseException extends FcException {
  static SCOPE = 64;
}
