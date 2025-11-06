import { ErrorCode } from '../enums';
import { TypeormBaseException } from './typeorm-base.exception';

export class TypeormQueryRunnerFailedException extends TypeormBaseException {
  static readonly CODE = ErrorCode.QUERY_FAILED;
}
