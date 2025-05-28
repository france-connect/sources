import { Test, TestingModule } from '@nestjs/testing';

import { MicroservicesRmqPublisherService } from '@fc/microservices-rmq';

import {
  CsmrHsmClientMessageDto,
  CsmrHsmClientResponseDto,
  CsmrHsmRandomMessageDto,
} from '../dto';
import { ActionTypes } from '../enums';
import { CsmrHsmClientService } from './csmr-hsm-client.service';

describe('CsmrHsmClientService', () => {
  let service: CsmrHsmClientService;

  const rmqServiceMock = {
    publish: jest.fn(),
  };

  const messageClientMock = {
    type: ActionTypes.SIGN,
  } as CsmrHsmClientMessageDto;

  const messageRandomMock = {
    type: ActionTypes.RANDOM,
  } as CsmrHsmRandomMessageDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsmrHsmClientService, MicroservicesRmqPublisherService],
    })
      .overrideProvider(MicroservicesRmqPublisherService)
      .useValue(rmqServiceMock)
      .compile();

    service = module.get<CsmrHsmClientService>(CsmrHsmClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publish', () => {
    it('should call rmqService.publish with message', async () => {
      // When
      await service.publish(messageClientMock);

      // Then
      expect(rmqServiceMock.publish).toHaveBeenCalledWith(
        ActionTypes.SIGN,
        messageClientMock,
        CsmrHsmClientResponseDto,
      );
    });

    it('should return result of rmqService.publish', async () => {
      // Given
      const publishResult = Symbol('result');
      rmqServiceMock.publish.mockResolvedValue(publishResult);

      // When
      const result = await service.publish(messageClientMock);

      // Then
      expect(result).toBe(publishResult);
    });
  });

  describe('random', () => {
    it('should call rmqService.random with message', async () => {
      // When
      await service.random(messageRandomMock);

      // Then
      expect(rmqServiceMock.publish).toHaveBeenCalledWith(
        ActionTypes.RANDOM,
        messageRandomMock,
        CsmrHsmClientResponseDto,
      );
    });

    it('should return result of rmqService.publish', async () => {
      // Given
      const publishResult = Symbol('result');
      rmqServiceMock.publish.mockResolvedValue(publishResult);

      // When
      const result = await service.random(messageRandomMock);

      // Then
      expect(result).toBe(publishResult);
    });
  });
});
