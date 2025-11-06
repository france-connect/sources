import { ErrorCode } from '../enums';
import { TypeormBaseException } from './typeorm-base.exception';

export class TypeormTransactionFailedException extends TypeormBaseException {
  static readonly CODE = ErrorCode.TRANSACTION_FAILED;
}
