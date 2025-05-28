import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import {
  BufferEncodingEnum,
  CsmrHsmClientMessageDto,
  CsmrHsmRandomMessageDto,
  SignatureDigest,
} from '@fc/csmr-hsm-client/protocol';
import { HsmService } from '@fc/hsm';
import { LoggerService } from '@fc/logger';
import { MicroservicesRmqSubscriberService } from '@fc/microservices-rmq';

import { getLoggerMock } from '@mocks/logger';
import { getSubscriberMock } from '@mocks/microservices-rmq';

import { CsmrHsmController } from './csmr-hsm.controller';
import { CsmrHsmRandomException } from './exceptions';

describe('CsmrHsmController', () => {
  let csmrHsmController: CsmrHsmController;

  const signResolvedValue = Buffer.from('signResolvedValue');
  const signMock = jest.fn();

  const randomString = 'randomStringValue';

  const hsmServiceMock = {
    sign: signMock,
    genRandom: jest.fn(),
  };

  const loggerServiceMock = getLoggerMock();

  const subscriberMock = getSubscriberMock();

  const configServiceMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CsmrHsmController],
      providers: [
        LoggerService,
        ConfigService,
        HsmService,
        MicroservicesRmqSubscriberService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(HsmService)
      .useValue(hsmServiceMock)
      .overrideProvider(MicroservicesRmqSubscriberService)
      .useValue(subscriberMock)
      .compile();

    csmrHsmController = app.get<CsmrHsmController>(CsmrHsmController);

    jest.resetAllMocks();
    signMock.mockReturnValue(signResolvedValue);
    configServiceMock.get.mockReturnValue({ payloadEncoding: 'base64' });
    hsmServiceMock.genRandom.mockReturnValue(randomString);
  });

  describe('sign', () => {
    // Given
    const payloadMock = {
      payload: {
        data: 'some string',
        digest: SignatureDigest.SHA256,
      },
    } as unknown as CsmrHsmClientMessageDto;

    it('should call hsm.sign', () => {
      // When
      csmrHsmController.sign(payloadMock);
      // Then
      expect(signMock).toHaveBeenCalledExactlyOnceWith(
        expect.any(Buffer),
        payloadMock.payload.digest,
      );
    });

    it('should call the subscriber.response', () => {
      // When
      csmrHsmController.sign(payloadMock);
      // Then
      expect(subscriberMock.response).toHaveBeenCalledExactlyOnceWith(
        signResolvedValue.toString('base64'),
      );
    });
  });

  describe('random', () => {
    // Given
    const payloadMock = {
      payload: { length: 64, encoding: BufferEncodingEnum.HEX },
    } as unknown as CsmrHsmRandomMessageDto;

    it('should call hsm.genRandom', () => {
      // When
      csmrHsmController.random(payloadMock);
      // Then
      expect(hsmServiceMock.genRandom).toHaveBeenCalledExactlyOnceWith(
        64,
        'hex',
      );
    });

    it('should call the subscriber.response', () => {
      // When
      csmrHsmController.random(payloadMock);
      // Then
      expect(subscriberMock.response).toHaveBeenCalledExactlyOnceWith(
        randomString,
      );
    });
  });

  describe('randomWithoutMicroService', () => {
    // Given
    const payload = { length: 64, encoding: BufferEncodingEnum.HEX };

    it('should call hsm.genRandom', () => {
      // When
      csmrHsmController.randomWithoutMicroService(payload);
      // Then
      expect(hsmServiceMock.genRandom).toHaveBeenCalledExactlyOnceWith(
        64,
        'hex',
      );
    });

    it('should return stringified hsm.random response', () => {
      // When
      const result = csmrHsmController.randomWithoutMicroService(payload);
      // Then
      expect(result).toBe(randomString);
    });

    it('should log an error if execution throwed', () => {
      // Given
      const errorMock = new Error();
      hsmServiceMock.genRandom.mockImplementationOnce(() => {
        throw errorMock;
      });
      // When
      csmrHsmController.randomWithoutMicroService(payload);
      // Then
      expect(loggerServiceMock.err).toHaveBeenCalledExactlyOnceWith(
        new CsmrHsmRandomException(),
      );
    });

    it('should return "ERROR" if execution throwed', () => {
      // Given
      const errorMock = new Error();
      hsmServiceMock.genRandom.mockImplementationOnce(() => {
        throw errorMock;
      });
      // When
      const result = csmrHsmController.randomWithoutMicroService(payload);
      // Then
      expect(result).toEqual('ERROR');
    });
  });
});
