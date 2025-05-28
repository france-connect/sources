import { Test, TestingModule } from '@nestjs/testing';

import { MicroservicesRmqPublisherService } from '@fc/microservices-rmq';

import { CsmrProxyClientMessageDto } from '../dto';
import { CsmrProxyClientService } from './csmr-proxy-client.service';

describe('CsmrProxyClientService', () => {
  let service: CsmrProxyClientService;

  const rmqServiceMock = {
    broadcast: jest.fn(),
  };

  const messageMock = {} as CsmrProxyClientMessageDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsmrProxyClientService, MicroservicesRmqPublisherService],
    })
      .overrideProvider(MicroservicesRmqPublisherService)
      .useValue(rmqServiceMock)
      .compile();

    service = module.get<CsmrProxyClientService>(CsmrProxyClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publish', () => {
    it('should call rmqService.publish with message', async () => {
      await service.broadcast(messageMock);

      expect(rmqServiceMock.broadcast).toHaveBeenCalledWith(
        messageMock.type,
        messageMock,
      );
    });
  });
});
