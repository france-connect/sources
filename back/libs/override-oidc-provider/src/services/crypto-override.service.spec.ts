import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { ActionTypes } from '@fc/csmr-hsm-client';
import { throwException } from '@fc/exceptions';
import { SignatureDigest } from '@fc/hsm';
import { LoggerService } from '@fc/logger';
import { OverrideCode } from '@fc/override-code';

import { getLoggerMock } from '@mocks/logger';

import { CryptographyInvalidPayloadFormatException } from '../exceptions';
import { CryptoOverrideService } from './crypto-override.service';

jest.mock('@fc/exceptions');

describe('CryptoOverrideService', () => {
  let service: CryptoOverrideService;

  const configServiceMock = {
    get: jest.fn(),
  };

  const callbackMock = jest.fn();

  const csmrHsmClientMock = {
    publish: jest.fn(),
  };

  const loggerMock = getLoggerMock();

  const OverrideCodeSpy = jest.spyOn(OverrideCode, 'override');
  const throwExceptionMock = jest.mocked(throwException);

  const dataMock = Buffer.from('data');
  const digestMock = SignatureDigest.SHA256;
  const payloadEncodingMock = 'base64';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoOverrideService,
        ConfigService,
        LoggerService,
        {
          provide: 'CsmrHsmClient',
          useValue: csmrHsmClientMock,
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
    configServiceMock.get.mockReturnValue({
      payloadEncoding: payloadEncodingMock,
      requestTimeout: 200,
    });

    csmrHsmClientMock.publish.mockResolvedValue({
      payload: dataMock.toString(payloadEncodingMock),
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
  });

  describe('crypto.sign', () => {
    it('should call crypto Gateway High Service', () => {
      // Given
      const alg = SignatureDigest.SHA256;
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
      const alg = SignatureDigest.SHA256;
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
    it('should call hsm.publihs method with message', () => {
      // Given
      const expectedMessage = {
        type: ActionTypes.SIGN,
        payload: {
          data: dataMock.toString('base64'),
          digest: digestMock,
        },
      };

      // When
      service.sign(dataMock, digestMock, callbackMock);

      // Then
      expect(csmrHsmClientMock.publish).toHaveBeenCalledWith(expectedMessage);
    });

    it('should call callback with buffer result', async () => {
      // Given
      const expectedBuffer = Buffer.from(
        dataMock.toString(payloadEncodingMock),
        payloadEncodingMock,
      );

      // When
      service.sign(dataMock, digestMock, callbackMock);
      await new Promise(process.nextTick);

      // Then
      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(null, expectedBuffer);
    });

    it('should call throwException in case of error', async () => {
      // Given
      const errorMock = new Error('publish error');
      csmrHsmClientMock.publish.mockRejectedValueOnce(errorMock);

      // When
      service.sign(dataMock, undefined, callbackMock);
      await new Promise(process.nextTick);

      // Then
      expect(throwExceptionMock).toHaveBeenCalledExactlyOnceWith(errorMock);
    });
  });
});
