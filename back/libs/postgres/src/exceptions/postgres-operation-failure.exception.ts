import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { PostgresBaseException } from './postgres-base.exception';

export class PostgresOperationFailure extends PostgresBaseException {
  static DOCUMENTATION =
    "Une erreur est survenue lors de l'appel à la base de donnée. Contacter le support N3.";
  static CODE = ErrorCode.POSTGRES_OPERATION_FAILURE;
  static UI = 'Postgres.exceptions.PostgresOperationFailure';

  static HTTP_STATUS_CODE = HttpStatus.UNAUTHORIZED;
}
