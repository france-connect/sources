import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';

import { getConfigMock } from '@mocks/config';

import { HUB_SIGN_PREFIX } from '../constants';
import { WebhooksService } from './webhooks.service';

describe('WebhooksService', () => {
  let service: WebhooksService;

  const mockHookName = 'testHook';

  const configMock = getConfigMock();

  const cryptoMock = {
    hmac: jest.fn(),
  };

  const secret = 'testSecret';
  const hmacMockResult = 'mockedHmac';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhooksService, ConfigService, CryptographyService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptoMock)
      .compile();

    service = module.get<WebhooksService>(WebhooksService);

    configMock.get.mockReturnValue({
      secret,
    });

    cryptoMock.hmac.mockReturnValue(hmacMockResult);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sign', () => {
    it('should sign a string payload and return a signature', () => {
      // Given
      const payload = 'testPayload';

      // When
      const result = service.sign(mockHookName, payload);

      // Then
      expect(result).toBe(`${HUB_SIGN_PREFIX}${hmacMockResult}`);
    });
  });

  describe('verifySignature', () => {
    // Given
    const signMockedResult = 'signMockedResult';
    const payload = "{ data: 'test' }";

    beforeEach(() => {
      service.sign = jest.fn().mockReturnValue(signMockedResult);
    });

    it('should verify a valid signature', () => {
      // Given
      const validSignature = signMockedResult;

      // When
      const result = service.verifySignature(
        mockHookName,
        payload,
        validSignature,
      );

      // Then
      expect(result).toBe(true);
    });

    it('should return false for an invalid signature shorter than valid signature', () => {
      // Given
      const invalidSignature = 'someInvalidSignature';

      // When
      const result = service.verifySignature(
        mockHookName,
        payload,
        invalidSignature,
      );

      // Then
      expect(result).toBe(false);
    });

    it('should return false for an invalid signature the same length as valid signature', () => {
      // Given
      const invalidSignature = 'signMockedErrorXx';

      // When
      const result = service.verifySignature(
        mockHookName,
        payload,
        invalidSignature,
      );

      // Then
      expect(result).toBe(false);
    });
  });
});
