import { ErrorCode } from '../enums';
import { TypeormBaseException } from './typeorm-base.exception';

export class TypeormNoInsertedEntityException extends TypeormBaseException {
  static readonly CODE = ErrorCode.NO_INSERTED_ENTITY;
}
