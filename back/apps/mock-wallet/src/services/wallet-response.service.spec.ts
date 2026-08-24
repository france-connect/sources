import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { getConfigMock } from '@mocks/config';

import { RequestObjectPayload, WalletResponsePayload } from '../interfaces';
import { MockWalletCryptoService } from './mock-wallet-crypto.service';
import { WalletResponseService } from './wallet-response.service';

describe('WalletResponseService', () => {
  let service: WalletResponseService;

  const configMock = getConfigMock();
  const cryptoMock = {
    encryptJarm: jest.fn(),
  };

  const responsePayload: WalletResponsePayload = {
    state: 'state-mock',
    vp_token: 'vp-token-mock',
    presentation_submission: {
      id: 'id',
      definition_id: 'def',
      descriptor_map: [],
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletResponseService,
        ConfigService,
        MockWalletCryptoService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(MockWalletCryptoService)
      .useValue(cryptoMock)
      .compile();

    service = module.get<WalletResponseService>(WalletResponseService);

    configMock.get.mockReturnValue({
      responseContentType: 'application/x-www-form-urlencoded',
      httpTimeoutMs: 5000,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buildPostBody', () => {
    it('should build the JARM body for direct_post.jwt', async () => {
      // Given
      cryptoMock.encryptJarm.mockResolvedValue('jwe-mock');
      const request = {
        response_mode: 'direct_post.jwt',
      } as RequestObjectPayload;

      // When
      const result = await service.buildPostBody(responsePayload, request);

      // Then
      expect(result).toEqual({ state: 'state-mock', response: 'jwe-mock' });
    });

    it('should omit state from JARM body when absent', async () => {
      // Given
      cryptoMock.encryptJarm.mockResolvedValue('jwe-mock');
      const request = {
        response_mode: 'direct_post.jwt',
      } as RequestObjectPayload;
      const payloadWithoutState: WalletResponsePayload = {
        ...responsePayload,
        state: undefined,
      };

      // When
      const result = await service.buildPostBody(payloadWithoutState, request);

      // Then
      expect(result).toEqual({ response: 'jwe-mock' });
      expect(result).not.toHaveProperty('state');
    });

    it('should build the clear body for direct_post', async () => {
      // Given
      const request = { response_mode: 'direct_post' } as RequestObjectPayload;

      // When
      const result = await service.buildPostBody(responsePayload, request);

      // Then
      expect(result).toEqual({
        state: 'state-mock',
        vp_token: 'vp-token-mock',
        presentation_submission: JSON.stringify(
          responsePayload.presentation_submission,
        ),
      });
      expect(cryptoMock.encryptJarm).not.toHaveBeenCalled();
    });

    it('should omit state from clear body when absent', async () => {
      // Given
      const request = { response_mode: 'direct_post' } as RequestObjectPayload;
      const payloadWithoutState: WalletResponsePayload = {
        ...responsePayload,
        state: undefined,
      };

      // When
      const result = await service.buildPostBody(payloadWithoutState, request);

      // Then
      expect(result).toEqual({
        vp_token: 'vp-token-mock',
        presentation_submission: JSON.stringify(
          responsePayload.presentation_submission,
        ),
      });
      expect(result).not.toHaveProperty('state');
    });
  });

  describe('post', () => {
    const fetchMock = jest.fn();
    const postBodyMock = {
      state: 'state-mock',
      response: 'jarm-jwe-mock',
    };

    beforeEach(() => {
      global.fetch = fetchMock as unknown as typeof fetch;
    });

    it('should POST the body and surface the outcome with the redirect uri', async () => {
      // Given
      fetchMock.mockResolvedValue({
        status: 200,
        text: () =>
          Promise.resolve('{"redirect_uri":"https://verifier.example/cb"}'),
      });

      // When
      const result = await service.post(
        'https://verifier.example/response',
        postBodyMock,
      );

      // Then
      expect(result).toEqual({
        statusCode: 200,
        responseBody: '{"redirect_uri":"https://verifier.example/cb"}',
        redirectUri: 'https://verifier.example/cb',
      });
    });

    it('should surface a non-JSON body without a redirect uri', async () => {
      // Given
      fetchMock.mockResolvedValue({
        status: 400,
        text: () => Promise.resolve('plain error'),
      });

      // When
      const result = await service.post(
        'https://verifier.example/response',
        postBodyMock,
      );

      // Then
      expect(result).toEqual({
        statusCode: 400,
        responseBody: 'plain error',
        redirectUri: undefined,
      });
    });
  });
});
