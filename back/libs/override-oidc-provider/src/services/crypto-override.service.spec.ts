import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import {
  CryptographyGatewayException,
  CryptographyInvalidPayloadFormatException,
} from '../exceptions';
import { OverrideCode } from '../helpers';
import { CryptoOverrideService } from './crypto-override.service';

describe('CryptoOverrideService', () => {
  let service: CryptoOverrideService;

  const configServiceMock = {
    get: jest.fn(),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  };

  const messageMock = {
    pipe: jest.fn(),
  };

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
      .useValue(loggerServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<CryptoOverrideService>(CryptoOverrideService);
    jest.resetAllMocks();
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
    it('should call OverrideCode 1 times', () => {
      // Given
      const OVERRIDE_COUNT = 1;
      // When
      service.onModuleInit();
      // Then
      expect(OverrideCodeSpy).toHaveBeenCalledTimes(OVERRIDE_COUNT);
    });
    it('should call broker.connect', () => {
      // When
      service.onModuleInit();
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
    it('should call crypto Gateway High Service', async () => {
      // Given
      const alg = 'alg';
      const payload = new Uint8Array([0, 42, 42, 0]);
      const key = Symbol('key');
      service.sign = jest.fn();
      // When
      await service['crypto.sign'](alg, payload, key);
      // Then
      expect(service.sign).toHaveBeenCalledWith(key, Buffer.from(payload), alg);
    });

    it('should throw a CryptographyInvalidPayloadFormatException if the payload is not a Uint8Array', async () => {
      // Given
      const alg = 'alg';
      const payload = '1, 2, 3, 4, 5';
      const key = Symbol('key');
      service.sign = jest.fn();

      // When / Then
      await expect(() =>
        service['crypto.sign'](alg, payload as unknown as Uint8Array, key),
      ).toThrow(CryptographyInvalidPayloadFormatException);
    });
  });

  describe('sign', () => {
    // Given
    const keyMock = 'key';
    const dataMock = Buffer.from('data');
    const digestMock = 'digest';

    it('should return a `Promise` in case of success', async () => {
      // When
      const result = service.sign(keyMock, dataMock, digestMock);

      // Then
      expect(result instanceof Promise);
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(2);

      // Clean
      await result;
    });

    it('should call reject and throw a `CryptoOverrideService` exception in case of failure', async () => {
      // Given
      const badKeyMock = null;
      const badDataMock = null;
      // When
      // Then
      await expect(service.sign(badKeyMock, badDataMock)).rejects.toThrow(
        CryptographyGatewayException,
      );
    });

    it('should call signSuccess with error message', async () => {
      // Given
      const resolveMock = jest.fn();
      const rejectMock = jest.fn();

      // When
      service['signSuccess'](resolveMock, rejectMock, 'ERROR');

      // Then
      expect(rejectMock).toHaveBeenCalledTimes(1);
    });

    it('should reject if response is "ERROR"', async () => {
      // Given
      const rejectMock = jest.fn();
      const signSuccessMock = jest.spyOn<CryptoOverrideService, any>(
        service,
        'signSuccess',
      );

      // When
      pipeMock.subscribe.mockImplementationOnce(({ next }) => {
        const call = next.bind(service);
        call(null, rejectMock, 'ERROR');
      });

      // Then
      await expect(service.sign(keyMock, dataMock, digestMock)).rejects.toThrow(
        CryptographyGatewayException,
      );

      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(2);
      expect(signSuccessMock).toHaveBeenCalledTimes(1);
    });

    it('should reject if something turned bad', async () => {
      // Given
      pipeMock.subscribe.mockImplementationOnce(() => {
        throw new CryptographyGatewayException();
      });

      // Then
      await expect(service.sign(keyMock, dataMock)).rejects.toThrow(
        CryptographyGatewayException,
      );
    });

    it('should reject if observable throws', async () => {
      // Given
      const error = Error('not good');
      pipeMock.subscribe.mockImplementationOnce(
        ({ next: _success, error: failure }) => failure(error),
      );

      // Then
      await expect(service.sign(keyMock, dataMock)).rejects.toThrow(
        CryptographyGatewayException,
      );
    });
  });
});
