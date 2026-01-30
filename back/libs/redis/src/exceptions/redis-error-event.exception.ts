import { ErrorCode } from '../enums';
import { RedisBaseException } from './redis-base.exception';

export class RedisErrorEventException extends RedisBaseException {
  static CODE = ErrorCode.ERROR_EVENT;
  static UI = 'Redis.errorEvent';
}
