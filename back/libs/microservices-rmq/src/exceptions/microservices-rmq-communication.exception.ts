import { ErrorCode } from '../enums';
import { MicroservicesRmqBaseException } from './microservices-rmq-base.exception';

export class MicroservicesRmqCommunicationException extends MicroservicesRmqBaseException {
  static CODE = ErrorCode.COMMUNICATION_EXCEPTION;

  constructor(error) {
    super(error);
    this.log = { error };
  }
}
