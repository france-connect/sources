import { v4 as uuid } from 'uuid';

import { Test, TestingModule } from '@nestjs/testing';

import { parameterizedPath } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
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
    presentationId: 'presentationIdMock',
    inputDescriptorId: 'inputDescriptorIdMock',
    inputFieldPaths: [field1Path, field2Path],
    inputFieldPurpose: 'purposeMock',
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
    presentationId: 'presentationIdMock',
    state: 'stateMock',
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
      service.getAuthorizeRequestUri(interactionMock);

      // Then
      expect(configMock.get).toHaveBeenCalledWith('Openid4vp');
    });

    it('should retrieve the request configuration from the interaction presentationId', () => {
      // When
      service.getAuthorizeRequestUri(interactionMock);

      // Then
      expect(service.getRequestById).toHaveBeenCalledExactlyOnceWith(
        interactionMock.presentationId,
      );
    });

    it('should build the request URI by interpolating the interaction id', () => {
      // When
      service.getAuthorizeRequestUri(interactionMock);

      // Then
      expect(parameterizedPathMock).toHaveBeenNthCalledWith(
        1,
        relayingPartyMock.requestUri,
        { interactionId: interactionMock.id },
      );
      expect(parameterizedPathMock).toHaveBeenNthCalledWith(
        2,
        relayingPartyMock.clientId,
        { interactionId: interactionMock.id },
      );
    });

    it('should build an openid4vp URL with client_id, request_uri and response_type', () => {
      // Given
      const interpolatedUri = 'https://example.com/request/interactionIdMock';
      parameterizedPathMock.mockReturnValueOnce(interpolatedUri);

      // When
      const result = service.getAuthorizeRequestUri(interactionMock);

      // Then
      expect(result).toBe(
        `openid4vp://authorize?client_id=${relayingPartyMock.clientId}&request_uri=${encodeURIComponent(interpolatedUri)}&response_type=${requestConfigMock.responseType}`,
      );
    });
  });

  describe('getRequestById', () => {
    it('should return the request that matches the presentationId', () => {
      // When
      const result = service.getRequestById(requestConfigMock.presentationId);

      // Then
      expect(result).toBe(requestConfigMock);
    });

    it('should return undefined when no request matches', () => {
      // When
      const result = service.getRequestById('unknownPresentationIdMock');

      // Then
      expect(result).toBeUndefined();
    });
  });

  describe('generateInteractionParams', () => {
    const sessionIdMock = 'sessionIdValue';
    const stateMock = 'stateValue';
    const nonceMock = 'nonceValue';
    const uuidValue = 'uuidValue';
    const nowMock = 10000000;
    const interactionIdMock = 'interactionIdMock';

    beforeEach(() => {
      uuidMock.mockReturnValue(uuidValue);
      sessionMock.getId.mockReturnValue(sessionIdMock);
      cryptoServiceMock.genRandomString
        .mockReturnValueOnce(stateMock)
        .mockReturnValueOnce(nonceMock);
      jest.spyOn(Date, 'now').mockReturnValue(nowMock);
    });

    it('should retrieve the session id', () => {
      // When
      service.generateInteractionParams(
        interactionIdMock,
        'presentationIdMock',
      );

      // Then
      expect(sessionMock.getId).toHaveBeenCalledExactlyOnceWith();
    });

    it('should generate the state with the configured length', () => {
      // When
      service.generateInteractionParams(
        interactionIdMock,
        'presentationIdMock',
      );

      // Then
      expect(cryptoServiceMock.genRandomString).toHaveBeenNthCalledWith(
        1,
        relayingPartyMock.stateLength,
      );
    });

    it('should generate the nonce with the configured length', () => {
      // When
      service.generateInteractionParams(
        interactionIdMock,
        'presentationIdMock',
      );

      // Then
      expect(cryptoServiceMock.genRandomString).toHaveBeenNthCalledWith(
        2,
        relayingPartyMock.nonceLength,
      );
    });

    it('should return the interaction params with the generated identifiers', () => {
      // When
      const result = service.generateInteractionParams(
        interactionIdMock,
        'presentationIdMock',
      );

      // Then
      expect(result).toStrictEqual({
        id: interactionIdMock,
        presentationId: 'presentationIdMock',
        state: stateMock,
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

    beforeEach(() => {
      openid4vpCryptoMock.getPublicJwks.mockResolvedValue(publicJwksMock);
    });

    it('should resolve the JWKs from the crypto service', async () => {
      // When
      await service.createAuthorizationRequestPayload(
        interactionMock,
        requestConfigMock,
      );

      // Then
      expect(
        openid4vpCryptoMock.getPublicJwks,
      ).toHaveBeenCalledExactlyOnceWith();
    });

    it('should interpolate every relaying-party URL with the interaction id', async () => {
      // Given
      const { clientId, responseUri, requestUri } = relayingPartyMock;
      const params = { interactionId: interactionMock.id };

      // When
      await service.createAuthorizationRequestPayload(
        interactionMock,
        requestConfigMock,
      );

      // Then
      expect(parameterizedPathMock).toHaveBeenNthCalledWith(
        1,
        clientId,
        params,
      );
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

    it('should build a payload with the interaction iat, exp, state and nonce', async () => {
      // When
      const result = await service.createAuthorizationRequestPayload(
        interactionMock,
        requestConfigMock,
      );

      // Then
      expect(result).toEqual(
        expect.objectContaining({
          iat: interactionMock.iat,
          exp: interactionMock.exp,
          state: interactionMock.state,
          nonce: interactionMock.nonce,
        }),
      );
    });

    it('should build a payload with the request response type and response mode', async () => {
      // When
      const result = await service.createAuthorizationRequestPayload(
        interactionMock,
        requestConfigMock,
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
      );

      // Then
      expect(result.client_metadata).toEqual({
        vp_formats: relayingPartyMock.clientMetadata.formats,
        token_endpoint_auth_method:
          relayingPartyMock.clientMetadata.token_endpoint_auth_method,
        authorization_encrypted_response_alg:
          relayingPartyMock.clientMetadata.authorization_encrypted_response_alg,
        authorization_encrypted_response_enc:
          relayingPartyMock.clientMetadata.authorization_encrypted_response_enc,
        jwks: publicJwksMock,
      });
    });

    it('should build a presentation definition with one input descriptor for each input field path', async () => {
      // When
      const result = await service.createAuthorizationRequestPayload(
        interactionMock,
        requestConfigMock,
      );

      const expectedPurpose = requestConfigMock.inputFieldPurpose;
      const expectedIntentToRetain = requestConfigMock.inputFieldIntentToRetain;
      const expectedFields = [
        {
          path: [field1Path],
          purpose: expectedPurpose,
          intent_to_retain: expectedIntentToRetain,
        },
        {
          path: [field2Path],
          purpose: expectedPurpose,
          intent_to_retain: expectedIntentToRetain,
        },
      ];

      // Then
      expect(result.presentation_definition).toEqual({
        id: requestConfigMock.presentationId,
        input_descriptors: [
          {
            id: requestConfigMock.inputDescriptorId,
            format: relayingPartyMock.clientMetadata.formats,
            constraints: {
              limit_disclosure: 'required',
              fields: expectedFields,
            },
          },
        ],
      });
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

    it('should build the authorization request payload from the interaction and the request config', async () => {
      // When
      await service.createAuthorizeRequestObject(
        interactionMock,
        requestConfigMock,
      );

      // Then
      expect(
        service.createAuthorizationRequestPayload,
      ).toHaveBeenCalledExactlyOnceWith(interactionMock, requestConfigMock);
    });

    it('should resolve the JWT signer from the crypto service', async () => {
      // When
      await service.createAuthorizeRequestObject(
        interactionMock,
        requestConfigMock,
      );

      // Then
      expect(openid4vpCryptoMock.getJwtSigner).toHaveBeenCalledOnce();
    });

    it('should call createOpenid4vpAuthorizationRequest with the payload, callbacks and JAR options', async () => {
      // When
      await service.createAuthorizeRequestObject(
        interactionMock,
        requestConfigMock,
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
      );

      // Then
      expect(result).toBe(requestObjectMock);
    });
  });

  describe('generateConstraintField', () => {
    it('should generate a constraint field with the provided path, purpose and intent to retain', () => {
      // When
      const result = service['generateConstraintField'](
        '$.path1',
        'purposeMock',
        true,
      );

      // Then
      expect(result).toEqual({
        path: ['$.path1'],
        purpose: 'purposeMock',
        intent_to_retain: true,
      });
    });
  });

  describe('generateConstraintFields', () => {
    const paths = ['a', 'b'];

    beforeEach(() => {
      service['generateConstraintField'] = jest
        .fn()
        .mockReturnValueOnce('y')
        .mockReturnValueOnce('z');
    });

    it('should generate constraint fields for each path', () => {
      // When
      service['generateConstraintFields'](paths, 'purposeMock', true);

      // Then
      expect(service['generateConstraintField']).toHaveBeenCalledTimes(2);
      expect(service['generateConstraintField']).toHaveBeenNthCalledWith(
        1,
        'a',
        'purposeMock',
        true,
      );
      expect(service['generateConstraintField']).toHaveBeenNthCalledWith(
        2,
        'b',
        'purposeMock',
        true,
      );
    });

    it('should return an array of mapped constraint fields', () => {
      // When
      const result = service['generateConstraintFields'](
        paths,
        'purposeMock',
        true,
      );

      // Then
      expect(result).toEqual(['y', 'z']);
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
