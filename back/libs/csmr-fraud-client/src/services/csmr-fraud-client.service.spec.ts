import { Test, TestingModule } from '@nestjs/testing';

import { MicroservicesRmqPublisherService } from '@fc/microservices-rmq';

import { FraudCaseMessageDto, FraudTracksMessageDto } from '../dto';
import { CsmrFraudClientService } from './csmr-fraud-client.service';

describe('CsmrFraudClientService', () => {
  let service: CsmrFraudClientService;

  const rmqServiceMock = {
    publish: jest.fn(),
  };

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

  describe('publishFraudCase', () => {
    const messageMock = {} as FraudCaseMessageDto;

    it('should call rmqService.publish with message', async () => {
      await service.publishFraudCase(messageMock);

      expect(rmqServiceMock.publish).toHaveBeenCalledWith(
        messageMock.type,
        messageMock,
      );
    });

    it('should return result of rmqService.publish', async () => {
      const publishResult = Symbol('result');
      rmqServiceMock.publish.mockResolvedValue(publishResult);

      const result = await service.publishFraudCase(messageMock);

      expect(result).toBe(publishResult);
    });
  });

  describe('publishFraudTracks', () => {
    const messageMock = {} as FraudTracksMessageDto;

    it('should call rmqService.publish with message', async () => {
      await service.publishFraudTracks(messageMock);

      expect(rmqServiceMock.publish).toHaveBeenCalledWith(
        messageMock.type,
        messageMock,
      );
    });

    it('should return result of rmqService.publish', async () => {
      const publishResult = Symbol('result');
      rmqServiceMock.publish.mockResolvedValue(publishResult);

      const result = await service.publishFraudTracks(messageMock);

      expect(result).toBe(publishResult);
    });
  });
});
