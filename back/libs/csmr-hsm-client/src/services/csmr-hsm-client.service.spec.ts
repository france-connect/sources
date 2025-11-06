import { Test, TestingModule } from '@nestjs/testing';

import { DigestsForAlg } from '@fc/cryptography';
import {
  BufferEncodingEnum,
  MicroservicesRmqPublisherService,
} from '@fc/microservices-rmq';

import { CsmrHsmClientResponseDto, CsmrHsmRandomMessageDto } from '../dto';
import { ActionTypes } from '../enums';
import { CsmrHsmClientService } from './csmr-hsm-client.service';

describe('CsmrHsmClientService', () => {
  let service: CsmrHsmClientService;

  const signatureMock = 'signature';
  const encodedSignature = Buffer.from(signatureMock).toString(
    BufferEncodingEnum.BASE64,
  );
  const publishResult = { payload: encodedSignature };

  const rmqServiceMock = {
    publish: jest.fn(),
  };

  const dataMock = 'data';

  const encodedData = Buffer.from(dataMock).toString(BufferEncodingEnum.BASE64);

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

    rmqServiceMock.publish.mockResolvedValue(publishResult);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sign', () => {
    it('should call rmqService.sign with message', async () => {
      // When
      await service.sign(
        dataMock,
        'ES256' as keyof DigestsForAlg,
        BufferEncodingEnum.BASE64,
      );

      // Then
      expect(rmqServiceMock.publish).toHaveBeenCalledWith(
        ActionTypes.SIGN,
        {
          type: ActionTypes.SIGN,
          payload: { data: encodedData, digest: DigestsForAlg.ES256 },
        },
        CsmrHsmClientResponseDto,
      );
    });

    it('should return result of rmqService.sign', async () => {
      // When
      const result = await service.sign(
        dataMock,
        'ES256' as keyof DigestsForAlg,
        BufferEncodingEnum.BASE64,
      );

      // Then
      expect(result).toBeInstanceOf(Buffer);
      expect(result.toString(BufferEncodingEnum.BASE64)).toEqual(
        publishResult.payload,
      );
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
      // When
      const result = await service.random(messageRandomMock);

      // Then
      expect(result).toBe(publishResult);
    });
  });
});
