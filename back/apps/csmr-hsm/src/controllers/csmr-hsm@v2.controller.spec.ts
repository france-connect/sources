import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import {
  BufferEncodingEnum,
  CsmrHsmClientMessageDto,
  CsmrHsmRandomMessageDto,
  SignatureDigest,
} from '@fc/csmr-hsm-client/protocol';
import { HsmService } from '@fc/hsm';
import { MicroservicesRmqSubscriberService } from '@fc/microservices-rmq';

import { getSubscriberMock } from '@mocks/microservices-rmq';

import { CsmrHsmController_v2 } from './csmr-hsm@v2.controller';

describe('CsmrHsmController', () => {
  let csmrHsmController: CsmrHsmController_v2;

  const signResolvedValue = Buffer.from('signResolvedValue');
  const signMock = jest.fn();

  const randomString = 'randomStringValue';

  const hsmServiceMock = {
    sign: signMock,
    genRandom: jest.fn(),
  };

  const subscriberMock = getSubscriberMock();

  const configServiceMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CsmrHsmController_v2],
      providers: [ConfigService, HsmService, MicroservicesRmqSubscriberService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(HsmService)
      .useValue(hsmServiceMock)
      .overrideProvider(MicroservicesRmqSubscriberService)
      .useValue(subscriberMock)
      .compile();

    csmrHsmController = app.get<CsmrHsmController_v2>(CsmrHsmController_v2);

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
});
