import { BaseException } from '../exceptions';

export function getClass(exception: BaseException): typeof BaseException {
  return exception.constructor as typeof BaseException;
}
