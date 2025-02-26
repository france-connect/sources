import { ErrorCode } from '../enums';
import { MicroservicesRmqBaseException } from './microservices-rmq-base.exception';

export class MicroservicesRmqResponseNoPayloadException extends MicroservicesRmqBaseException {
  static CODE = ErrorCode.RESPONSE_NO_PAYLOAD;
}
