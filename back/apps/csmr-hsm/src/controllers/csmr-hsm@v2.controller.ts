import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ConfigService } from '@fc/config';
import {
  ActionTypes,
  CsmrHsmClientMessageDto,
  CsmrHsmRandomMessageDto,
  Versions,
} from '@fc/csmr-hsm-client/protocol';
import { HsmService } from '@fc/hsm';
import {
  MicroservicesRmqConfig,
  MicroservicesRmqMessageValidationPipe,
  MicroservicesRmqSubscriberService,
} from '@fc/microservices-rmq';

const VERSION = Versions.V2;

@Controller()
export class CsmrHsmController_v2 {
  constructor(
    private readonly config: ConfigService,
    private readonly hsm: HsmService,
    private readonly subscriber: MicroservicesRmqSubscriberService,
  ) {}

  @MessagePattern(`${ActionTypes.SIGN}@${VERSION}`)
  @UsePipes(MicroservicesRmqMessageValidationPipe)
  sign(@Payload() { payload }: CsmrHsmClientMessageDto) {
    const { payloadEncoding } = this.config.get<MicroservicesRmqConfig>(
      'CsmrHsmClientMicroService',
    );
    const { data, digest } = payload;

    const dataBuffer = Buffer.from(data, payloadEncoding);
    const signedBuffer = this.hsm.sign(dataBuffer, digest);
    const signed = signedBuffer.toString(payloadEncoding);

    return this.subscriber.response(signed);
  }

  @MessagePattern(`${ActionTypes.RANDOM}@${VERSION}`)
  @UsePipes(MicroservicesRmqMessageValidationPipe)
  random(@Payload() { payload }: CsmrHsmRandomMessageDto) {
    const { length, encoding } = payload;

    const alea = this.hsm.genRandom(length, encoding);

    return this.subscriber.response(alea);
  }
}
