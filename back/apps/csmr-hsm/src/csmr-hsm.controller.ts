import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ConfigService } from '@fc/config';
import {
  ActionTypes,
  CsmrHsmClientMessageDto,
  CsmrHsmRandomMessageDto,
  RandomPayloadDto,
} from '@fc/csmr-hsm-client/protocol';
import { ValidationException } from '@fc/exceptions';
import { HsmService } from '@fc/hsm';
import { LoggerService } from '@fc/logger';
import {
  MicroservicesRmqConfig,
  MicroservicesRmqMessageValidationPipe,
  MicroservicesRmqSubscriberService,
} from '@fc/microservices-rmq';

import { CsmrHsmRandomException } from './exceptions';

@Controller()
export class CsmrHsmController {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly hsm: HsmService,
    private readonly subscriber: MicroservicesRmqSubscriberService,
  ) {}

  @MessagePattern(ActionTypes.SIGN)
  @UsePipes(MicroservicesRmqMessageValidationPipe)
  sign(@Payload() { payload }: CsmrHsmClientMessageDto) {
    this.logger.debug(`received new ${ActionTypes.SIGN} command`);

    const { payloadEncoding } = this.config.get<MicroservicesRmqConfig>(
      'CsmrHsmClientMicroService',
    );
    const { data, digest } = payload;

    const dataBuffer = Buffer.from(data, payloadEncoding);
    const signedBuffer = this.hsm.sign(dataBuffer, digest);
    const signed = signedBuffer.toString(payloadEncoding);

    return this.subscriber.response(signed);
  }

  @MessagePattern(ActionTypes.RANDOM_MICROSERVICE)
  @UsePipes(MicroservicesRmqMessageValidationPipe)
  random(@Payload() { payload }: CsmrHsmRandomMessageDto) {
    this.logger.debug(
      `received new ${ActionTypes.RANDOM_MICROSERVICE} command`,
    );
    const { length, encoding } = payload;

    const alea = this.hsm.genRandom(length, encoding);

    return this.subscriber.response(alea);
  }

  @MessagePattern(ActionTypes.RANDOM)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: ValidationException.factory,
    }),
  )
  randomWithoutMicroService(@Payload() payload: RandomPayloadDto) {
    this.logger.debug(`received new ${ActionTypes.RANDOM} command`);
    const { length, encoding } = payload;

    try {
      return this.hsm.genRandom(length, encoding);
      // You can't remove the catch argument, it's mandatory
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      this.logger.err(new CsmrHsmRandomException());
      return 'ERROR';
    }
  }
}
