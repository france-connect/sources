import { Injectable } from '@nestjs/common';

import { MicroservicesRmqPublisherService } from '@fc/microservices-rmq';

import { CsmrProxyClientMessageDto } from '../dto';

@Injectable()
export class CsmrProxyClientService {
  constructor(private readonly rmqService: MicroservicesRmqPublisherService) {}

  async broadcast(message: CsmrProxyClientMessageDto): Promise<void> {
    return await this.rmqService.broadcast<CsmrProxyClientMessageDto>(
      message.type,
      message,
    );
  }
}
