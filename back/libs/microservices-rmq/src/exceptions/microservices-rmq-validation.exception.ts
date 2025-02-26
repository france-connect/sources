import { ValidationError } from 'class-validator';

import { ErrorCode } from '../enums';
import { MicroservicesRmqBaseException } from './microservices-rmq-base.exception';

export class MicroservicesRmqValidationException extends MicroservicesRmqBaseException {
  static CODE = ErrorCode.VALIDATION_EXCEPTION;
  constructor(errors: ValidationError[]) {
    super();
    this.log = errors;
  }
}
