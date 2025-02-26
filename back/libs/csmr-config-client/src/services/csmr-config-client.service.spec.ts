import { Test, TestingModule } from '@nestjs/testing';

import { MicroservicesRmqPublisherService } from '@fc/microservices-rmq';

import { ConfigMessageDto } from '../dto';
import { CsmrConfigClientService } from './csmr-config-client.service';

describe('CsmrConfigClientService', () => {
  let service: CsmrConfigClientService;

  const rmqServiceMock = {
    publish: jest.fn(),
  };

  const messageMock = {} as ConfigMessageDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsmrConfigClientService, MicroservicesRmqPublisherService],
    })
      .overrideProvider(MicroservicesRmqPublisherService)
      .useValue(rmqServiceMock)
      .compile();

    service = module.get<CsmrConfigClientService>(CsmrConfigClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publish', () => {
    it('should call rmqService.publish with message', async () => {
      await service.publish(messageMock);

      expect(rmqServiceMock.publish).toHaveBeenCalledWith(
        messageMock.type,
        messageMock,
      );
    });

    it('should return result of rmqService.publish', async () => {
      const publishResult = Symbol('result');
      rmqServiceMock.publish.mockResolvedValue(publishResult);

      const result = await service.publish(messageMock);

      expect(result).toBe(publishResult);
    });
  });
});
