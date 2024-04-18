import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { HsmService, SignatureDigest } from '@fc/hsm';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { CsmrHsmController } from './csmr-hsm.controller';
import { CsmrHsmRandomException, CsmrHsmSignException } from './exceptions';

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

  const configServiceMock = {
    get: jest.fn(),
  };

  const payloadMock = {
    data: 'some string',
    digest: 'sha256' as SignatureDigest,
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CsmrHsmController],
      providers: [LoggerService, ConfigService, HsmService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(HsmService)
      .useValue(hsmServiceMock)
      .compile();

    csmrHsmController = app.get<CsmrHsmController>(CsmrHsmController);

    jest.resetAllMocks();
    signMock.mockReturnValue(signResolvedValue);
    configServiceMock.get.mockReturnValue({ payloadEncoding: 'base64' });
    hsmServiceMock.genRandom.mockReturnValue(randomString);
  });

  describe('sign', () => {
    it('should call hsm.sign', () => {
      // When
      csmrHsmController.sign(payloadMock);
      // Then
      expect(signMock).toHaveBeenCalledTimes(1);
      expect(signMock).toHaveBeenCalledWith(
        expect.any(Buffer),
        payloadMock.digest,
      );
    });

    it('should resolve to stringified hsm.sign response', () => {
      const base64result = Buffer.from(signResolvedValue).toString('base64');
      // When
      const result = csmrHsmController.sign(payloadMock);
      // Then
      expect(result).toBe(base64result);
    });

    it('should log an error if execution threw', () => {
      // Given
      const errorMock = new Error();
      signMock.mockImplementationOnce(() => {
        throw errorMock;
      });
      // When
      csmrHsmController.sign(payloadMock);
      // Then
      expect(loggerServiceMock.err).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.err).toHaveBeenCalledWith(
        new CsmrHsmSignException(),
      );
    });

    it('should resolve to "ERROR" if execution threw', () => {
      hsmServiceMock.sign.mockImplementationOnce(() => {
        throw new Error('something not good');
      });
      // When
      const result = csmrHsmController.sign(payloadMock);
      // Then
      expect(result).toBe('ERROR');
    });
  });

  describe('random', () => {
    // Given
    const payload = { length: 64, encoding: 'hex' as BufferEncoding };

    it('should call hsm.random', () => {
      // When
      csmrHsmController.random(payload);
      // Then
      expect(hsmServiceMock.genRandom).toHaveBeenCalledTimes(1);
    });

    it('should return stringified hsm.random response', () => {
      // When
      const result = csmrHsmController.random(payload);
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
      csmrHsmController.random(payload);
      // Then
      expect(loggerServiceMock.err).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.err).toHaveBeenCalledWith(
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
      const result = csmrHsmController.random(payload);
      // Then
      expect(result).toEqual('ERROR');
    });
  });
});
