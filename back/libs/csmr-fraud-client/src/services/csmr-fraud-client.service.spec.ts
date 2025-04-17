import { Test, TestingModule } from '@nestjs/testing';

import { MicroservicesRmqPublisherService } from '@fc/microservices-rmq';

import { FraudMessageDto } from '../dto';
import { CsmrFraudClientService } from './csmr-fraud-client.service';

describe('CsmrFraudClientService', () => {
  let service: CsmrFraudClientService;

  const rmqServiceMock = {
    publish: jest.fn(),
  };

  const messageMock = {} as FraudMessageDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsmrFraudClientService, MicroservicesRmqPublisherService],
    })
      .overrideProvider(MicroservicesRmqPublisherService)
      .useValue(rmqServiceMock)
      .compile();

    service = module.get<CsmrFraudClientService>(CsmrFraudClientService);
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
