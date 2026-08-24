import { Test, TestingModule } from '@nestjs/testing';

import { getValidDto, nowInSeconds } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import {
  Openid4vpClientIdSchemeEnum,
  Openid4vpResponseMode,
  Openid4vpResponseType,
} from '@fc/openid4vp';
import { Openid4vpDeepLinkInterface } from '@fc/openid4vp/interfaces';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import {
  MockWalletClientIdMismatchException,
  MockWalletInvalidJarException,
  MockWalletInvalidRequestObjectHeaderException,
  MockWalletInvalidRequestObjectPayloadException,
  MockWalletJarFetchException,
} from '../exceptions';
import { MockWalletCryptoService } from './mock-wallet-crypto.service';
import { RequestObjectService } from './request-object.service';

jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
  getValidDto: jest.fn(),
}));

describe('RequestObjectService', () => {
  let service: RequestObjectService;

  const getValidDtoMock = jest.mocked(getValidDto);

  const configMock = getConfigMock();
  const loggerMock = getLoggerMock();
  const cryptoMock = {
    verifySignature: jest.fn(),
    decodeProtectedHeader: jest.fn(),
    decodePayload: jest.fn(),
  };

  const appConfigMock = {
    httpTimeoutMs: 5000,
    permissiveContentType: false,
    skipSignatureVerification: false,
    allowedAlgs: ['ES256'],
    allowedResponseModes: ['direct_post', 'direct_post.jwt'],
    allowHttpResponseUri: false,
  };

  const compactJwt = 'header.payload.signature';

  const deepLinkMock = {
    requestUri: 'https://verifier.example/request-object',
    requestUriMethod: 'get',
    clientId: 'client-mock',
  } as unknown as Openid4vpDeepLinkInterface;

  const validHeader = { typ: 'oauth-authz-req+jwt', alg: 'ES256' };
  const validPayload = {
    response_type: Openid4vpResponseType.VP_TOKEN,
    response_mode: Openid4vpResponseMode.DIRECT_POST_JWT,
    nonce: 'nonce-mock',
    client_id: 'client-mock',
    client_id_scheme: Openid4vpClientIdSchemeEnum.REDIRECT_URI,
    response_uri: 'https://verifier.example/response',
    exp: nowInSeconds() + 600,
    usesHttp: false,
    presentation_definition: {
      id: 'def',
      input_descriptors: [{ id: 'eu.europa.ec.eudi.pid.1', constraints: {} }],
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestObjectService,
        ConfigService,
        LoggerService,
        MockWalletCryptoService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(MockWalletCryptoService)
      .useValue(cryptoMock)
      .compile();

    service = module.get<RequestObjectService>(RequestObjectService);

    configMock.get.mockReturnValue(appConfigMock);
    cryptoMock.decodeProtectedHeader.mockReturnValue(validHeader);
    cryptoMock.decodePayload.mockReturnValue(validPayload);

    // Default: both header validation and payload validation succeed
    getValidDtoMock.mockResolvedValue(validPayload);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetch', () => {
    const fetchMock = jest.fn();

    beforeEach(() => {
      global.fetch = fetchMock as unknown as typeof fetch;
      fetchMock.mockResolvedValue({
        headers: { get: () => 'application/oauth-authz-req+jwt' },
        text: () => Promise.resolve(compactJwt),
        status: 200,
      });
    });

    it('should return the compact JWS from the request_uri', async () => {
      // When
      const result = await service.fetch(deepLinkMock.requestUri);

      // Then
      expect(result).toBe(compactJwt);
    });

    it('should throw on an unexpected content-type', async () => {
      // Given
      fetchMock.mockResolvedValue({
        headers: { get: () => 'text/html' },
        text: () => Promise.resolve(compactJwt),
        status: 200,
      });

      // When / Then
      await expect(service.fetch(deepLinkMock.requestUri)).rejects.toThrow(
        MockWalletJarFetchException,
      );
    });

    it('should throw when the body is not a compact JWS', async () => {
      // Given
      fetchMock.mockResolvedValue({
        headers: { get: () => 'application/oauth-authz-req+jwt' },
        text: () => Promise.resolve('not-a-jws'),
        status: 200,
      });

      // When / Then
      await expect(service.fetch(deepLinkMock.requestUri)).rejects.toThrow(
        MockWalletInvalidJarException,
      );
    });

    it('should throw when the network call fails', async () => {
      // Given
      fetchMock.mockRejectedValue(new Error('network'));

      // When / Then
      await expect(service.fetch(deepLinkMock.requestUri)).rejects.toThrow(
        MockWalletJarFetchException,
      );
    });

    it('should throw when the content-type header is absent', async () => {
      // Given
      fetchMock.mockResolvedValue({
        headers: { get: () => null },
        text: () => Promise.resolve(compactJwt),
        status: 200,
      });

      // When / Then
      await expect(service.fetch(deepLinkMock.requestUri)).rejects.toThrow(
        MockWalletJarFetchException,
      );
    });

    it('should accept any content-type when permissive mode is enabled', async () => {
      // Given
      configMock.get.mockReturnValue({
        ...appConfigMock,
        permissiveContentType: true,
      });
      fetchMock.mockResolvedValue({
        headers: { get: () => 'text/html' },
        text: () => Promise.resolve(compactJwt),
        status: 200,
      });

      // When / Then
      await expect(service.fetch(deepLinkMock.requestUri)).resolves.toBe(
        compactJwt,
      );
    });
  });

  describe('validate', () => {
    it('should verify the signature when not skipped', async () => {
      // When
      await service.validate(compactJwt, deepLinkMock);

      // Then
      expect(cryptoMock.verifySignature).toHaveBeenCalledExactlyOnceWith(
        compactJwt,
      );
    });

    it('should not verify the signature when skipped', async () => {
      // Given
      configMock.get.mockReturnValue({
        ...appConfigMock,
        skipSignatureVerification: true,
      });

      // When
      await service.validate(compactJwt, deepLinkMock);

      // Then
      expect(cryptoMock.verifySignature).not.toHaveBeenCalled();
    });

    it('should return the validated payload', async () => {
      // When
      const result = await service.validate(compactJwt, deepLinkMock);

      // Then
      expect(result).toEqual(validPayload);
    });

    it('should throw when the header does not satisfy the header constraints', async () => {
      // Given — header validation (first getValidDto call) fails
      getValidDtoMock.mockRejectedValueOnce(new Error('invalid header'));

      // When / Then
      await expect(service.validate(compactJwt, deepLinkMock)).rejects.toThrow(
        MockWalletInvalidRequestObjectHeaderException,
      );
    });
  });

  describe('validatePayload', () => {
    beforeEach(() => {
      service['validateTiming'] = jest.fn();
    });

    it('should return the payload when valid', async () => {
      // When
      const result = await service.validatePayload(validPayload);

      // Then
      expect(result).toEqual(validPayload);
    });

    it('should throw when the payload is not valid', async () => {
      // Given
      getValidDtoMock.mockRejectedValue(new Error('invalid payload'));

      // When / Then
      await expect(service.validatePayload(validPayload)).rejects.toThrow(
        MockWalletInvalidRequestObjectPayloadException,
      );
    });
  });

  describe('validateTiming', () => {
    beforeEach(() => {
      service['isFutureClaim'] = jest.fn().mockReturnValue(true);
    });

    it('should throw when the payload is expired', async () => {
      // Given
      validPayload.exp = Math.floor(Date.now() / 1000) - 10;

      // When / Then
      await expect(service.validatePayload(validPayload)).rejects.toThrow(
        MockWalletInvalidRequestObjectPayloadException,
      );
    });

    it('should throw when the payload is not yet valid', async () => {
      // Given
      service['isFutureClaim'] = jest.fn().mockReturnValue(false);

      // When / Then
      await expect(service.validatePayload(validPayload)).rejects.toThrow(
        MockWalletInvalidRequestObjectPayloadException,
      );
    });
  });

  describe('isFutureClaim', () => {
    it('should return true when the claim is in the future', () => {
      // When
      const result = service['isFutureClaim'](10, 0);

      // Then
      expect(result).toBe(true);
    });

    it('should return false when the claim is in the past', () => {
      // When
      const result = service['isFutureClaim'](0, 10);

      // Then
      expect(result).toBe(false);
    });

    it('should return false when the claim is the same as the current time', () => {
      // When
      const result = service['isFutureClaim'](0, 0);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('checkCorrelation', () => {
    it('should throw when deepLink.clientId and payload.client_id are not the same', () => {
      // Given
      const payload = { ...validPayload, client_id: 'invalid-client-id' };

      // When / Then
      expect(() => service['checkCorrelation'](payload, deepLinkMock)).toThrow(
        MockWalletClientIdMismatchException,
      );
    });

    it('should throw when deepLink.clientId and payload.client_id are the same', () => {
      // When / Then
      expect(() =>
        service['checkCorrelation'](validPayload, deepLinkMock),
      ).not.toThrow();
    });

    it('should not throw when deepLink.clientId is undefined', () => {
      // Given
      const payload = { ...validPayload, client_id: undefined };

      // When / Then
      expect(() =>
        service['checkCorrelation'](payload, {
          ...deepLinkMock,
          clientId: undefined,
        }),
      ).not.toThrow();
    });
  });
});
