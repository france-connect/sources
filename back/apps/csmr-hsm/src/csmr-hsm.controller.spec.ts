import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { HsmService, SignatureDigest } from '@fc/hsm';
import { LoggerService } from '@fc/logger';

import { CsmrHsmController } from './csmr-hsm.controller';

describe('CsmrHsmController', () => {
  let csmrHsmController: CsmrHsmController;

  const signResolvedValue = Buffer.from('signResolvedValue');
  const signMock = jest.fn();

  const randomString = 'randomStringValue';

  const hsmServiceMock = {
    sign: signMock,
    genRandom: jest.fn(),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  };

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
    signMock.mockResolvedValue(signResolvedValue);
    configServiceMock.get.mockReturnValue({ payloadEncoding: 'base64' });
    hsmServiceMock.genRandom.mockReturnValue(randomString);
  });

  describe('sign', () => {
    it('should call hsm.sign', async () => {
      // When
      await csmrHsmController.sign(payloadMock);
      // Then
      expect(signMock).toHaveBeenCalledTimes(1);
      expect(signMock).toHaveBeenCalledWith(
        expect.any(Buffer),
        payloadMock.digest,
      );
    });
    it('should resolve to stringified hsm.sign response', async () => {
      const base64result = Buffer.from(signResolvedValue).toString('base64');
      // When
      const result = await csmrHsmController.sign(payloadMock);
      // Then
      expect(result).toBe(base64result);
    });
    it('should resolve to "ERROR" if execution throwed', async () => {
      hsmServiceMock.sign.mockRejectedValueOnce(Error('something not good'));
      // When
      const result = await csmrHsmController.sign(payloadMock);
      // Then
      expect(result).toBe('ERROR');
    });
  });

  describe('random', () => {
    // Given
    const payload = { length: 64, encoding: 'hex' as BufferEncoding };

    it('should call hsm.random', async () => {
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
