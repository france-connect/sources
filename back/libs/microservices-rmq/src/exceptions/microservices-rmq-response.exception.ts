import { ErrorCode } from '../enums';
import { MicroservicesRmqErrorInterface } from '../interfaces';
import { MicroservicesRmqBaseException } from './microservices-rmq-base.exception';

export class MicroservicesRmqResponseException extends MicroservicesRmqBaseException {
  static CODE = ErrorCode.RESPONSE_EXCEPTION;

  constructor(private readonly response: MicroservicesRmqErrorInterface) {
    super(response.type);
    this.originalError = {
      name: response.type,
      message: JSON.stringify(response.payload),
    };
    this.log = response;
  }
}
