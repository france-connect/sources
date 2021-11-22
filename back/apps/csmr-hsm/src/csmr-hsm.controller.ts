import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ConfigService } from '@fc/config';
import { ValidationException } from '@fc/exceptions';
import { HsmService } from '@fc/hsm';
import { LoggerService } from '@fc/logger';
import { CryptoProtocol } from '@fc/microservices';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { RandomPayloadDto, SignPayloadDto } from './dto';
import { CsmrHsmRandomException, CsmrHsmSignException } from './exceptions';

const BROKER_NAME = 'CryptographyBroker';

@Controller()
export class CsmrHsmController {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly hsm: HsmService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @MessagePattern(CryptoProtocol.Commands.SIGN)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: ValidationException.factory,
    }),
  )
  async sign(@Payload() payload: SignPayloadDto) {
    this.logger.debug(`received new ${CryptoProtocol.Commands.SIGN} command`);

    const { payloadEncoding } = this.config.get<RabbitmqConfig>(BROKER_NAME);
    const { data, digest } = payload;

    try {
      const dataBuffer = Buffer.from(data, payloadEncoding);
      const signedBuffer = await this.hsm.sign(dataBuffer, digest);
      const signed = signedBuffer.toString(payloadEncoding);
      return signed;
    } catch (error) {
      this.logger.error(new CsmrHsmSignException());
      this.logger.error(error);
      return 'ERROR';
    }
  }

  @MessagePattern(CryptoProtocol.Commands.RANDOM)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: ValidationException.factory,
    }),
  )
  random(@Payload() payload: RandomPayloadDto) {
    this.logger.debug(`received new ${CryptoProtocol.Commands.RANDOM} command`);
    const { length, encoding } = payload;

    try {
      return this.hsm.genRandom(length, encoding);
    } catch (error) {
      this.logger.error(new CsmrHsmRandomException());
      return 'ERROR';
    }
  }
}
