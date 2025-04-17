import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { CryptoProtocol } from '@fc/microservices';
import { OverrideCode } from '@fc/override-code';

import { getLoggerMock } from '@mocks/logger';

import {
  CryptographyGatewayException,
  CryptographyInvalidPayloadFormatException,
} from '../exceptions';
import { CryptoOverrideService } from './crypto-override.service';

describe('CryptoOverrideService', () => {
  let service: CryptoOverrideService;

  const configServiceMock = {
    get: jest.fn(),
  };

  const loggerMock = getLoggerMock();

  const messageMock = {
    pipe: jest.fn(),
  };
  const callbackMock = jest.fn();

  const brokerMock = {
    send: jest.fn(),
    connect: jest.fn(),
    close: jest.fn(),
  };

  const pipeMock = {
    subscribe: jest.fn(),
  };

  const brokerResponseMock = 'brokerResponseMock';

  const OverrideCodeSpy = jest.spyOn(OverrideCode, 'override');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoOverrideService,
        ConfigService,
        LoggerService,
        {
          provide: 'CryptographyBroker',
          useValue: brokerMock,
        },
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<CryptoOverrideService>(CryptoOverrideService);
    jest.resetAllMocks();
    jest.clearAllMocks();

    brokerMock.send.mockReturnValue(messageMock);
    messageMock.pipe.mockReturnValue(pipeMock);
    pipeMock.subscribe.mockImplementation(({ next }) =>
      next(brokerResponseMock),
    );
    configServiceMock.get.mockReturnValue({
      payloadEncoding: 'base64',
      requestTimeout: 200,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call OverrideCode 1 times', async () => {
      // Given
      const OVERRIDE_COUNT = 1;
      // When
      await service.onModuleInit();
      // Then
      expect(OverrideCodeSpy).toHaveBeenCalledTimes(OVERRIDE_COUNT);
    });
    it('should call broker.connect', async () => {
      // When
      await service.onModuleInit();
      // Then
      expect(brokerMock.connect).toHaveBeenCalledTimes(1);
    });
  });

  describe('onModuleDestroy', () => {
    it('should call broker.close', () => {
      // When
      service.onModuleDestroy();
      // Then
      expect(brokerMock.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('crypto.sign', () => {
    it('should call crypto Gateway High Service', () => {
      // Given
      const alg = 'alg';
      const payload = new Uint8Array([0, 42, 42, 0]);
      const key = Symbol('key');
      service.sign = jest.fn();

      // When
      service['crypto.sign'](alg, payload, key, callbackMock);
      // Then
      expect(service.sign).toHaveBeenCalledWith(
        Buffer.from(payload),
        alg,
        callbackMock,
      );
    });

    it('should throw a CryptographyInvalidPayloadFormatException if the payload is not a Uint8Array', () => {
      // Given
      const alg = 'alg';
      const payload = '1, 2, 3, 4, 5';
      const key = Symbol('key');
      service.sign = jest.fn();

      // When / Then
      expect(() =>
        service['crypto.sign'](
          alg,
          payload as unknown as Uint8Array,
          key,
          callbackMock,
        ),
      ).toThrow(CryptographyInvalidPayloadFormatException);
    });
  });

  describe('registerOverride', () => {
    const name = 'crypto.sign';

    it('should call OverrideCode.override', () => {
      // When
      service['registerOverride'](name);

      // Then
      expect(OverrideCodeSpy).toHaveBeenCalledTimes(1);
      expect(OverrideCodeSpy).toHaveBeenCalledWith(name, expect.any(Function));
    });

    it('should log a notice when an override is registered', () => {
      // When
      service['registerOverride'](name);

      // Then
      expect(loggerMock.notice).toHaveBeenCalledTimes(1);
      expect(loggerMock.notice).toHaveBeenCalledWith(
        `Registering function override for "${name}".`,
      );
    });
  });

  describe('sign', () => {
    // Given
    const dataMock = Buffer.from('data');
    const digestMock = 'digest';

    it('should call reject and throw a `CryptoOverrideService` exception in case of failure', () => {
      // Given
      const badDataMock = null;

      // When
      service.sign(badDataMock, digestMock, callbackMock);

      // Then
      expect(callbackMock).toHaveBeenCalledExactlyOnceWith(
        expect.any(CryptographyGatewayException),
        null,
      );
    });

    it('should call reject with error message', () => {
      // When
      service['signSuccess'](callbackMock, 'ERROR');

      // Then
      expect(callbackMock).toHaveBeenCalledExactlyOnceWith(
        expect.any(CryptographyGatewayException),
        null,
      );
    });

    it('should reject if response is "ERROR"', () => {
      // Given
      const signSuccessMock = jest.spyOn<CryptoOverrideService, any>(
        service,
        'signSuccess',
      );
      pipeMock.subscribe.mockImplementationOnce(({ next }) => {
        const call = next.bind(service);
        call(null, callbackMock, 'ERROR');
      });

      // When
      service.sign(dataMock, digestMock, callbackMock);

      // Then
      expect(signSuccessMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledExactlyOnceWith(
        expect.any(CryptographyGatewayException),
        null,
      );
    });

    it('should reject if something turned bad', () => {
      // Given
      pipeMock.subscribe.mockImplementationOnce(() => {
        throw new CryptographyGatewayException();
      });

      // When
      service.sign(dataMock, digestMock, callbackMock);

      // Then
      expect(callbackMock).toHaveBeenCalledExactlyOnceWith(
        expect.any(CryptographyGatewayException),
        null,
      );
    });

    it('should reject if observable throws', () => {
      // Given
      const error = Error('not good');
      pipeMock.subscribe.mockImplementationOnce(
        ({ next: _success, error: failure }) => failure(error),
      );

      // When
      service.sign(dataMock, digestMock, callbackMock);

      // Then
      expect(callbackMock).toHaveBeenCalledExactlyOnceWith(
        expect.any(CryptographyGatewayException),
        null,
      );
    });

    it('should use default if no digest is provided', () => {
      // When
      service.sign(dataMock, undefined, callbackMock);

      // Then
      expect(brokerMock.send).toHaveBeenCalledExactlyOnceWith(
        CryptoProtocol.Commands.SIGN,
        {
          data: dataMock.toString('base64'),
          digest: 'sha256',
        },
      );
    });
  });
});
