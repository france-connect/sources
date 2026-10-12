import { v4 as uuid } from 'uuid';

import { Test, TestingModule } from '@nestjs/testing';

import { parameterizedPath } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { DcqlService } from '@fc/dcql';
import { SessionService } from '@fc/session';

import { getConfigMock } from '@mocks/config';
import { createOpenid4vpAuthorizationRequest } from '@mocks/openid4vp';
import { getSessionServiceMock } from '@mocks/session';

import {
  Openid4vpConfig,
  Openid4vpInteractionDto,
  Openid4vpRequestConfig,
} from '../dto';
import {
  Openid4vpClientIdPrefixEnum,
  Openid4vpClientIdSchemeEnum,
  Openid4vpFlow,
  Openid4vpInteractionStatus,
} from '../enums';
import { Openid4vpCryptoService } from './openid4vp-crypto.service';
import { Openid4vpRequestService } from './openid4vp-request.service';

jest.mock('uuid');

jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
  parameterizedPath: jest.fn(),
}));

describe('Openid4vpRequestService', () => {
  jest.resetAllMocks();

  let service: Openid4vpRequestService;

  const configMock = getConfigMock();
  const cryptoServiceMock = {
    genRandomString: jest.fn(),
  };
  const sessionMock = getSessionServiceMock();
  const openid4vpCryptoMock = {
    requestCallbacks: Symbol('requestCallbacks'),
    getJwtSigner: jest.fn(),
    getPublicJwks: jest.fn(),
    getX509ClientId: jest.fn(),
  };
  const dcqlServiceMock = {
    buildMdocQuery: jest.fn(),
  };

  const uuidMock = uuid as unknown as jest.Mock;
  const parameterizedPathMock = jest.mocked(parameterizedPath);
  const createOpenid4vpAuthorizationRequestMock = jest.mocked(
    createOpenid4vpAuthorizationRequest,
  );

  const relayingPartyMock = {
    clientId: 'clientIdMock',
    clientIdScheme: 'redirect_uri',
    responseUri: 'https://example.com/response/:interactionId',
    redirectUri: 'https://example.com/redirect/:interactionId',
    requestUri: 'https://example.com/request/:interactionId',
    nonceLength: 32,
    stateLength: 32,
    interactionTtl: 600,
    responseDelay: 60,
    clientMetadata: {
      formats: { mso_mdoc: { alg: ['ES256'] } },
      token_endpoint_auth_method: 'tokenAuthMethodMock',
      authorization_encrypted_response_alg: 'algMock',
      authorization_encrypted_response_enc: 'encMock',
    },
  };

  const field1Path = '$.path1';
  const field2Path = '$.path2';
  const requestConfigMock = {
    credentialQueryId: 'credentialQueryIdMock',
    inputDescriptorId: 'inputDescriptorIdMock',
    inputFieldRequiredPaths: [field1Path, field2Path],
    inputFieldOptionalPaths: [],
    inputFieldIntentToRetain: true,
    responseType: 'vp_token',
    responseMode: 'direct_post.jwt',
  } as unknown as Openid4vpRequestConfig;

  const openid4vpConfigMock = {
    relayingParty: relayingPartyMock,
    requests: [requestConfigMock],
  } as unknown as Openid4vpConfig;

  const interactionMock: Openid4vpInteractionDto = {
    id: 'interactionIdMock',
    credentialQueryId: 'credentialQueryIdMock',
    state: {
      sameDevice: 'sameDeviceStateMock',
      crossDevice: 'crossDeviceStateMock',
    },
    nonce: 'nonceMock',
    iat: 1700000000,
    exp: 1700000600,
    status: Openid4vpInteractionStatus.REQUEST_URI_PROVIDED,
    sessionId: 'sessionIdMock',
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Openid4vpRequestService,
        ConfigService,
        Openid4vpCryptoService,
        CryptographyService,
        SessionService,
        DcqlService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(Openid4vpCryptoService)
      .useValue(openid4vpCryptoMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptoServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionMock)
      .overrideProvider(DcqlService)
      .useValue(dcqlServiceMock)
      .compile();

    service = module.get<Openid4vpRequestService>(Openid4vpRequestService);

    configMock.get.mockReturnValue(openid4vpConfigMock);
    parameterizedPathMock.mockImplementation((path: string) => path);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAuthorizeRequestUri', () => {
    beforeEach(() => {
      service.getRequestById = jest.fn().mockReturnValue(requestConfigMock);
    });

    it('should resolve the openid4vp configuration', () => {
      // When
      service.getAuthorizeRequestUri(
        interactionMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(configMock.get).toHaveBeenCalledWith('Openid4vp');
    });

    it('should retrieve the request configuration from the interaction credentialQueryId', () => {
      // When
      service.getAuthorizeRequestUri(
        interactionMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(service.getRequestById).toHaveBeenCalledExactlyOnceWith(
        interactionMock.credentialQueryId,
      );
    });

    it('should build the request URI by interpolating the interaction id and the state value', () => {
      // When
      service.getAuthorizeRequestUri(
        interactionMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(parameterizedPathMock).toHaveBeenNthCalledWith(
        1,
        relayingPartyMock.requestUri,
        {
          interactionId: interactionMock.id,
          state: interactionMock.state.sameDevice,
        },
      );
      expect(parameterizedPathMock).toHaveBeenNthCalledWith(
        2,
        relayingPartyMock.clientId,
        { interactionId: interactionMock.id },
      );
    });

    it('should use the crossDevice state value when flow is CROSS_DEVICE', () => {
      // When
      service.getAuthorizeRequestUri(
        interactionMock,
        Openid4vpFlow.CROSS_DEVICE,
      );

      // Then
      expect(parameterizedPathMock).toHaveBeenNthCalledWith(
        1,
        relayingPartyMock.requestUri,
        {
          interactionId: interactionMock.id,
          state: interactionMock.state.crossDevice,
        },
      );
    });

    it('should throw when no request configuration matches the credentialQueryId', () => {
      // Given
      service.getRequestById = jest.fn().mockReturnValue(undefined);

      // Then
      expect(() =>
        service.getAuthorizeRequestUri(
          interactionMock,
          Openid4vpFlow.SAME_DEVICE,
        ),
      ).toThrow(
        `No OpenID4VP request configuration matches credentialQueryId "${interactionMock.credentialQueryId}"`,
      );
    });

    it('should build an openid4vp URL with client_id, request_uri and response_type', () => {
      // Given
      const interpolatedUri = 'https://example.com/request/interactionIdMock';
      parameterizedPathMock.mockReturnValueOnce(interpolatedUri);

      // When
      const result = service.getAuthorizeRequestUri(
        interactionMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(result).toBe(
        `openid4vp://authorize?client_id=${relayingPartyMock.clientId}&request_uri=${encodeURIComponent(interpolatedUri)}&response_type=${requestConfigMock.responseType}`,
      );
    });
  });

  describe('getRequestById', () => {
    it('should return the request that matches the credentialQueryId', () => {
      // When
      const result = service.getRequestById(
        requestConfigMock.credentialQueryId,
      );

      // Then
      expect(result).toBe(requestConfigMock);
    });

    it('should return undefined when no request matches', () => {
      // When
      const result = service.getRequestById('unknownCredentialQueryIdMock');

      // Then
      expect(result).toBeUndefined();
    });
  });

  describe('generateInteractionParams', () => {
    const sessionIdMock = 'sessionIdValue';
    const sameDeviceStateMock = 'sameDeviceStateValue';
    const crossDeviceStateMock = 'crossDeviceStateValue';
    const nonceMock = 'nonceValue';
    const uuidValue = 'uuidValue';
    const nowMock = 10000000;
    const interactionIdMock = 'interactionIdMock';

    beforeEach(() => {
      uuidMock.mockReturnValue(uuidValue);
      sessionMock.getId.mockReturnValue(sessionIdMock);
      cryptoServiceMock.genRandomString
        .mockReturnValueOnce(sameDeviceStateMock)
        .mockReturnValueOnce(crossDeviceStateMock)
        .mockReturnValueOnce(nonceMock);
      jest.spyOn(Date, 'now').mockReturnValue(nowMock);
    });

    it('should retrieve the session id', () => {
      // When
      service.generateInteractionParams(
        interactionIdMock,
        'credentialQueryIdMock',
      );

      // Then
      expect(sessionMock.getId).toHaveBeenCalledExactlyOnceWith();
    });

    it('should generate the sameDevice state with the configured length', () => {
      // When
      service.generateInteractionParams(
        interactionIdMock,
        'credentialQueryIdMock',
      );

      // Then
      expect(cryptoServiceMock.genRandomString).toHaveBeenNthCalledWith(
        1,
        relayingPartyMock.stateLength,
      );
    });

    it('should generate the crossDevice state with the configured length', () => {
      // When
      service.generateInteractionParams(
        interactionIdMock,
        'credentialQueryIdMock',
      );

      // Then
      expect(cryptoServiceMock.genRandomString).toHaveBeenNthCalledWith(
        2,
        relayingPartyMock.stateLength,
      );
    });

    it('should generate the nonce with the configured length', () => {
      // When
      service.generateInteractionParams(
        interactionIdMock,
        'credentialQueryIdMock',
      );

      // Then
      expect(cryptoServiceMock.genRandomString).toHaveBeenNthCalledWith(
        3,
        relayingPartyMock.nonceLength,
      );
    });

    it('should generate two distinct state values', () => {
      // When
      const result = service.generateInteractionParams(
        interactionIdMock,
        'credentialQueryIdMock',
      );

      // Then
      expect(result.state.sameDevice).not.toBe(result.state.crossDevice);
    });

    it('should return the interaction params with the generated identifiers', () => {
      // When
      const result = service.generateInteractionParams(
        interactionIdMock,
        'credentialQueryIdMock',
      );

      // Then
      expect(result).toStrictEqual({
        id: interactionIdMock,
        credentialQueryId: 'credentialQueryIdMock',
        state: {
          sameDevice: sameDeviceStateMock,
          crossDevice: crossDeviceStateMock,
        },
        nonce: nonceMock,
        iat: Math.floor(nowMock / 1000),
        exp: Math.floor(nowMock / 1000) + relayingPartyMock.interactionTtl,
        status: Openid4vpInteractionStatus.REQUEST_URI_PROVIDED,
        sessionId: sessionIdMock,
      });
    });
  });

  describe('createAuthorizationRequestPayload', () => {
    const publicJwksMock = { keys: [{ kid: 'kidMock' }] };
    const attributeQueryMock = { dcql_query: { credentials: [] } };

    beforeEach(() => {
      openid4vpCryptoMock.getPublicJwks.mockResolvedValue(publicJwksMock);
      service['buildAttributeQuery'] = jest
        .fn()
        .mockReturnValue(attributeQueryMock);
    });

    it('should resolve the JWKs from the crypto service', async () => {
      // When
      await service.createAuthorizationRequestPayload(
        interactionMock,
        requestConfigMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(
        openid4vpCryptoMock.getPublicJwks,
      ).toHaveBeenCalledExactlyOnceWith();
    });

    it('should interpolate every relaying-party URL with the interaction id and state value', async () => {
      // Given
      const { clientId, responseUri, requestUri } = relayingPartyMock;
      const params = {
        interactionId: interactionMock.id,
        state: interactionMock.state.sameDevice,
      };

      // When
      await service.createAuthorizationRequestPayload(
        interactionMock,
        requestConfigMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(parameterizedPathMock).toHaveBeenNthCalledWith(1, clientId, {
        interactionId: interactionMock.id,
      });
      expect(parameterizedPathMock).toHaveBeenNthCalledWith(
        2,
        responseUri,
        params,
      );
      expect(parameterizedPathMock).toHaveBeenNthCalledWith(
        3,
        requestUri,
        params,
      );
    });

    it('should use the sameDevice state value when flow is SAME_DEVICE', async () => {
      // When
      const result = await service.createAuthorizationRequestPayload(
        interactionMock,
        requestConfigMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(result).toEqual(
        expect.objectContaining({ state: interactionMock.state.sameDevice }),
      );
    });

    it('should use the crossDevice state value when flow is CROSS_DEVICE', async () => {
      // When
      const result = await service.createAuthorizationRequestPayload(
        interactionMock,
        requestConfigMock,
        Openid4vpFlow.CROSS_DEVICE,
      );

      // Then
      expect(result).toEqual(
        expect.objectContaining({ state: interactionMock.state.crossDevice }),
      );
    });

    it('should build a payload with the interaction iat, exp and nonce', async () => {
      // When
      const result = await service.createAuthorizationRequestPayload(
        interactionMock,
        requestConfigMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(result).toEqual(
        expect.objectContaining({
          iat: interactionMock.iat,
          exp: interactionMock.exp,
          nonce: interactionMock.nonce,
        }),
      );
    });

    it('should build a payload with the request response type and response mode', async () => {
      // When
      const result = await service.createAuthorizationRequestPayload(
        interactionMock,
        requestConfigMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(result).toEqual(
        expect.objectContaining({
          response_type: requestConfigMock.responseType,
          response_mode: requestConfigMock.responseMode,
        }),
      );
    });

    it('should build a payload with the client metadata and the public JWKs', async () => {
      // When
      const result = await service.createAuthorizationRequestPayload(
        interactionMock,
        requestConfigMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(result.client_metadata).toEqual({
        vp_formats_supported: relayingPartyMock.clientMetadata.formats,
        token_endpoint_auth_method:
          relayingPartyMock.clientMetadata.token_endpoint_auth_method,
        authorization_encrypted_response_alg:
          relayingPartyMock.clientMetadata.authorization_encrypted_response_alg,
        authorization_encrypted_response_enc:
          relayingPartyMock.clientMetadata.authorization_encrypted_response_enc,
        jwks: publicJwksMock,
      });
    });

    it('should build the attribute query from the request', async () => {
      // When
      await service.createAuthorizationRequestPayload(
        interactionMock,
        requestConfigMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(service['buildAttributeQuery']).toHaveBeenCalledExactlyOnceWith(
        requestConfigMock,
      );
    });

    it('should include the attribute query in the payload', async () => {
      // When
      const result = await service.createAuthorizationRequestPayload(
        interactionMock,
        requestConfigMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(result).toEqual(expect.objectContaining(attributeQueryMock));
    });
  });

  describe('createAuthorizeRequestObject', () => {
    const payloadMock = {
      request_uri: 'requestUriMock',
      exp: 1700000600,
    };
    const jwtSignerMock = Symbol('jwtSigner');
    const requestObjectMock = Symbol('requestObject') as unknown as ReturnType<
      typeof createOpenid4vpAuthorizationRequest
    >;

    beforeEach(() => {
      service.createAuthorizationRequestPayload = jest
        .fn()
        .mockResolvedValue(payloadMock);
      openid4vpCryptoMock.getJwtSigner.mockResolvedValue(jwtSignerMock);
      createOpenid4vpAuthorizationRequestMock.mockResolvedValue(
        requestObjectMock,
      );
    });

    it('should build the authorization request payload from the interaction, request config and flow', async () => {
      // When
      await service.createAuthorizeRequestObject(
        interactionMock,
        requestConfigMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(
        service.createAuthorizationRequestPayload,
      ).toHaveBeenCalledExactlyOnceWith(
        interactionMock,
        requestConfigMock,
        Openid4vpFlow.SAME_DEVICE,
      );
    });

    it('should build the authorization request with the crossDevice state value when flow is CROSS_DEVICE', async () => {
      // When
      await service.createAuthorizeRequestObject(
        interactionMock,
        requestConfigMock,
        Openid4vpFlow.CROSS_DEVICE,
      );

      // Then
      expect(parameterizedPath).toHaveBeenCalledWith(
        relayingPartyMock.requestUri,
        expect.objectContaining({
          state: interactionMock.state.crossDevice,
        }),
      );
    });

    it('should resolve the JWT signer from the crypto service', async () => {
      // When
      await service.createAuthorizeRequestObject(
        interactionMock,
        requestConfigMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(openid4vpCryptoMock.getJwtSigner).toHaveBeenCalledOnce();
    });

    it('should call createOpenid4vpAuthorizationRequest with the payload, callbacks and JAR options including state value', async () => {
      // When
      await service.createAuthorizeRequestObject(
        interactionMock,
        requestConfigMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(
        createOpenid4vpAuthorizationRequestMock,
      ).toHaveBeenCalledExactlyOnceWith({
        authorizationRequestPayload: payloadMock,
        callbacks: openid4vpCryptoMock.requestCallbacks,
        jar: {
          requestUri: relayingPartyMock.requestUri,
          jwtSigner: jwtSignerMock,
          expiresInSeconds: relayingPartyMock.interactionTtl,
        },
      });
    });

    it('should return the request object built by the library', async () => {
      // When
      const result = await service.createAuthorizeRequestObject(
        interactionMock,
        requestConfigMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(result).toBe(requestObjectMock);
    });
  });

  describe('buildAttributeQuery', () => {
    const dcqlQueryMock = { credentials: [{ id: 'pid-fc' }] };

    beforeEach(() => {
      service['buildDcqlQuery'] = jest.fn().mockReturnValue(dcqlQueryMock);
    });

    it('should build a dcql_query from the request', () => {
      // When
      const result = service['buildAttributeQuery'](requestConfigMock);

      // Then
      expect(service['buildDcqlQuery']).toHaveBeenCalledExactlyOnceWith(
        requestConfigMock,
      );
      expect(result).toEqual({ dcql_query: dcqlQueryMock });
    });
  });

  describe('buildDcqlQuery', () => {
    const dcqlQueryMock = { credentials: [{ id: 'pid-fc' }] };

    beforeEach(() => {
      dcqlServiceMock.buildMdocQuery.mockReturnValue(dcqlQueryMock);
    });

    it('should build the mdoc DCQL query from the request configuration', () => {
      // When
      service['buildDcqlQuery'](requestConfigMock);

      // Then
      expect(dcqlServiceMock.buildMdocQuery).toHaveBeenCalledWith({
        id: requestConfigMock.credentialQueryId,
        doctype: requestConfigMock.inputDescriptorId,
        requiredPaths: requestConfigMock.inputFieldRequiredPaths,
        optionalPaths: requestConfigMock.inputFieldOptionalPaths,
        intentToRetain: requestConfigMock.inputFieldIntentToRetain,
      });
    });

    it('should return the query built by the DCQL service', () => {
      // When
      const result = service['buildDcqlQuery'](requestConfigMock);

      // Then
      expect(result).toBe(dcqlQueryMock);
    });
  });

  describe('getFlowState', () => {
    it('should return the sameDevice state value when flow is SAME_DEVICE', () => {
      // When
      const result = service['getFlowState'](
        Openid4vpFlow.SAME_DEVICE,
        interactionMock,
      );

      // Then
      expect(result).toBe(interactionMock.state.sameDevice);
    });

    it('should return the crossDevice state value when flow is CROSS_DEVICE', () => {
      // When
      const result = service['getFlowState'](
        Openid4vpFlow.CROSS_DEVICE,
        interactionMock,
      );

      // Then
      expect(result).toBe(interactionMock.state.crossDevice);
    });
  });

  describe('resolveClientId', () => {
    const x509ClientIdMock = `${Openid4vpClientIdPrefixEnum.X509_HASH}x509ClientIdMock`;
    const parameterizedPathMockValue =
      'https://example.com/clientId/:interactionId';

    beforeEach(() => {
      openid4vpCryptoMock.getX509ClientId.mockReturnValue(x509ClientIdMock);
      parameterizedPathMock.mockReturnValueOnce(parameterizedPathMockValue);
    });

    it('should return the client id when the client id scheme is redirect_uri', () => {
      // Given
      configMock.get.mockReturnValueOnce({
        relayingParty: {
          clientIdScheme: Openid4vpClientIdSchemeEnum.REDIRECT_URI,
        },
      });

      // When
      const result = service['resolveClientId'](interactionMock);

      // Then
      expect(result).toBe(parameterizedPathMockValue);
    });

    it('should compute the parametrized path for redirect_uri with client id', () => {
      // Given
      configMock.get.mockReturnValueOnce({
        relayingParty: {
          clientIdScheme: Openid4vpClientIdSchemeEnum.REDIRECT_URI,
          clientId: 'clientIdMock',
        },
      });

      // When
      service['resolveClientId'](interactionMock);

      // Then
      expect(parameterizedPathMock).toHaveBeenCalledWith('clientIdMock', {
        interactionId: interactionMock.id,
      });
    });

    it('should return the client id when the client id scheme is x509_hash', () => {
      // Given
      configMock.get.mockReturnValueOnce({
        relayingParty: {
          clientIdScheme: Openid4vpClientIdSchemeEnum.X509_HASH,
        },
      });

      // When
      const result = service['resolveClientId'](interactionMock);

      // Then
      expect(result).toBe(x509ClientIdMock);
    });
  });
});
