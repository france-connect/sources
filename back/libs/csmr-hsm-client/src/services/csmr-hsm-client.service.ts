import { Injectable } from '@nestjs/common';

import { DigestsForAlg } from '@fc/cryptography';
import {
  BufferEncodingEnum,
  MicroservicesRmqPublisherService,
} from '@fc/microservices-rmq';

import {
  CsmrHsmClientMessageDto,
  CsmrHsmClientResponseDto,
  CsmrHsmRandomMessageDto,
} from '../dto';
import { ActionTypes } from '../enums';

@Injectable()
export class CsmrHsmClientService {
  constructor(private readonly rmqService: MicroservicesRmqPublisherService) {}

  async sign(
    data: string,
    alg: keyof DigestsForAlg,
    payloadEncoding: BufferEncodingEnum,
  ): Promise<Buffer> {
    const digest = DigestsForAlg[alg];

    const message = {
      type: ActionTypes.SIGN,
      payload: { data: Buffer.from(data).toString(payloadEncoding), digest },
    };

    const { payload } = await this.rmqService.publish<
      CsmrHsmClientMessageDto,
      CsmrHsmClientResponseDto
    >(message.type, message, CsmrHsmClientResponseDto);

    return Buffer.from(payload, payloadEncoding);
  }

  async random(
    message: CsmrHsmRandomMessageDto,
  ): Promise<CsmrHsmClientResponseDto> {
    return await this.rmqService.publish<
      CsmrHsmRandomMessageDto,
      CsmrHsmClientResponseDto
    >(message.type, message, CsmrHsmClientResponseDto);
  }
}
