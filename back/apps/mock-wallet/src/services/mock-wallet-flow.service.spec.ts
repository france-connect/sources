import { Test, TestingModule } from '@nestjs/testing';

import { Openid4vpAuthorizationError } from '@fc/openid4vp/enums';
import { Openid4vpDeepLinkInterface } from '@fc/openid4vp/interfaces';

import { SubmitBodyDto, SubmitErrorBodyDto } from '../dto';
import { Flows, MockWalletRoutes } from '../enums';
import { IdentityService } from './identity.service';
import { MockWalletFlowService } from './mock-wallet-flow.service';
import { PresentationService } from './presentation.service';
import { RequestObjectService } from './request-object.service';
import { WalletResponseService } from './wallet-response.service';

describe('MockWalletFlowService', () => {
  let service: MockWalletFlowService;

  const deepLinkMock = {
    toString: jest.fn(),
    requestUri: 'openid4vp://authorize?...',
  };

  const requestObjectMock = {
    fetch: jest.fn(),
    validate: jest.fn(),
    validatePayload: jest.fn(),
  };
  const identityMock = {
    getIdentity: jest.fn(),
    getIdentities: jest.fn(),
  };
  const presentationMock = {
    extractRequestedClaims: jest.fn(),
    selectClaims: jest.fn(),
    buildResponsePayload: jest.fn(),
  };
  const responseMock = { buildPostBody: jest.fn(), post: jest.fn() };

  const requestPayload = {
    response_uri: 'https://verifier.example/response',
    presentation_definition: {
      id: 'def',
      input_descriptors: [{ id: 'eu.europa.ec.eudi.pid.1', constraints: {} }],
    },
  };
  const identity = { docType: 'pid', attributes: { family_name: 'DUPONT' } };
  const responsePayload = {
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
        MockWalletFlowService,
        RequestObjectService,
        IdentityService,
        PresentationService,
        WalletResponseService,
      ],
    })
      .overrideProvider(RequestObjectService)
      .useValue(requestObjectMock)
      .overrideProvider(IdentityService)
      .useValue(identityMock)
      .overrideProvider(PresentationService)
      .useValue(presentationMock)
      .overrideProvider(WalletResponseService)
      .useValue(responseMock)
      .compile();

    service = module.get<MockWalletFlowService>(MockWalletFlowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('selectIdentity', () => {
    beforeEach(() => {
      identityMock.getIdentities.mockReturnValue([
        {
          docType: 'pid',
          attributes: { family_name: 'DUPONT', given_name: 'JEAN' },
        },
        {
          docType: 'pid',
          attributes: { family_name: 'MARTIN', given_name: 'ALICE' },
        },
      ]);
    });

    it('should return the selectable identities with their CSV index', () => {
      // When
      const result = service.selectIdentity(
        deepLinkMock as unknown as Openid4vpDeepLinkInterface,
        Flows.CROSS_DEVICE,
      );

      // Then
      expect(result).toEqual({
        url: deepLinkMock.toString(),
        flow: Flows.CROSS_DEVICE,
        authorizeUrl: MockWalletRoutes.WALLET_AUTHORIZE,
        identities: [
          {
            index: 0,
            docType: 'pid',
            attributes: { family_name: 'DUPONT', given_name: 'JEAN' },
          },
          {
            index: 1,
            docType: 'pid',
            attributes: { family_name: 'MARTIN', given_name: 'ALICE' },
          },
        ],
      });
    });
  });

  describe('authorize', () => {
    beforeEach(() => {
      requestObjectMock.fetch.mockResolvedValue('jwt-mock');
      requestObjectMock.validate.mockResolvedValue(requestPayload);
      identityMock.getIdentity.mockReturnValue(identity);
      presentationMock.extractRequestedClaims.mockReturnValue(['family_name']);
      presentationMock.selectClaims.mockReturnValue({ family_name: 'DUPONT' });
      presentationMock.buildResponsePayload.mockResolvedValue(responsePayload);
    });

    it('should fetch and validate the request object from the deep link', async () => {
      // When
      await service.authorize(
        deepLinkMock as unknown as Openid4vpDeepLinkInterface,
        Flows.CROSS_DEVICE,
        0,
      );

      // Then
      expect(requestObjectMock.fetch).toHaveBeenCalledExactlyOnceWith(
        deepLinkMock.requestUri,
      );
      expect(requestObjectMock.validate).toHaveBeenCalledExactlyOnceWith(
        'jwt-mock',
        deepLinkMock,
      );
      expect(identityMock.getIdentity).toHaveBeenCalledExactlyOnceWith(0);
    });

    it('should return a consent view model with the displayed claims and serialized payloads', async () => {
      // When
      const result = await service.authorize(
        deepLinkMock as unknown as Openid4vpDeepLinkInterface,
        Flows.CROSS_DEVICE,
        0,
      );

      // Then
      expect(result).toEqual({
        availableClaims: ['family_name'],
        responseUri: requestPayload.response_uri,
        responsePreview: JSON.stringify(responsePayload, null, 2),
        requestPayload: JSON.stringify(requestPayload, null, 2),
        responsePayload: JSON.stringify(responsePayload, null, 2),
        presentationDefinition: JSON.stringify(
          requestPayload.presentation_definition,
          null,
          2,
        ),
        submitUrl: MockWalletRoutes.WALLET_SUBMIT,
        submitErrorUrl: MockWalletRoutes.WALLET_SUBMIT_ERROR,
        flow: Flows.CROSS_DEVICE,
      });
    });
  });

  describe('submit', () => {
    // Given
    const body = {
      responseUri: 'https://verifier.example/response',
      requestPayload: requestPayload,
      responsePayload: responsePayload,
    } as unknown as SubmitBodyDto;

    beforeEach(() => {
      requestObjectMock.validatePayload.mockResolvedValue(requestPayload);
    });

    it('should validate the request object payload timing', async () => {
      // When
      await service.submit(body);

      // Then
      expect(requestObjectMock.validatePayload).toHaveBeenCalledExactlyOnceWith(
        requestPayload,
      );
    });

    it('should build the post body with the response and the request payloads', async () => {
      // When
      await service.submit(body);

      // Then
      expect(responseMock.buildPostBody).toHaveBeenCalledWith(
        responsePayload,
        requestPayload,
      );
    });

    it('should post the body to the response uri', async () => {
      // When
      await service.submit(body);

      // Then
      expect(responseMock.post).toHaveBeenCalledExactlyOnceWith(
        body.responseUri,
      );
    });
  });

  describe('authorizeError', () => {
    // Given
    const requestPayloadWithState = { ...requestPayload, state: 'state-mock' };
    const errorPostBodyMock = { error: 'errorMock' };

    beforeEach(() => {
      service['buildErrorPostBody'] = jest
        .fn()
        .mockReturnValue(errorPostBodyMock);

      requestObjectMock.fetch.mockResolvedValue('jwt-mock');
      requestObjectMock.validate.mockResolvedValue(requestPayloadWithState);
    });

    it('should fetch and validate the request object from the deep link', async () => {
      // When
      await service.authorizeError(
        deepLinkMock as unknown as Openid4vpDeepLinkInterface,
      );

      // Then
      expect(requestObjectMock.fetch).toHaveBeenCalledExactlyOnceWith(
        deepLinkMock.requestUri,
      );
      expect(requestObjectMock.validate).toHaveBeenCalledExactlyOnceWith(
        'jwt-mock',
        deepLinkMock,
      );
    });

    it('should post the error body built from the request state to the response uri', async () => {
      // When
      await service.authorizeError(
        deepLinkMock as unknown as Openid4vpDeepLinkInterface,
      );

      // Then
      expect(service['buildErrorPostBody']).toHaveBeenCalledExactlyOnceWith(
        requestPayloadWithState.state,
        undefined,
        undefined,
      );
      expect(responseMock.post).toHaveBeenCalledExactlyOnceWith(
        requestPayloadWithState.response_uri,
        errorPostBodyMock,
      );
    });

    it('should forward the provided error and description to the post body', async () => {
      // When
      await service.authorizeError(
        deepLinkMock as unknown as Openid4vpDeepLinkInterface,
        Openid4vpAuthorizationError.SERVER_ERROR,
        'errorDescriptionMock',
      );

      // Then
      expect(service['buildErrorPostBody']).toHaveBeenCalledExactlyOnceWith(
        requestPayloadWithState.state,
        Openid4vpAuthorizationError.SERVER_ERROR,
        'errorDescriptionMock',
      );
    });
  });

  describe('submitError', () => {
    // Given
    const requestPayloadWithState = { ...requestPayload, state: 'state-mock' };
    const errorPostBodyMock = { error: 'errorMock' };
    const body = {
      responseUri: 'https://verifier.example/response',
      requestPayload: requestPayloadWithState,
      flow: Flows.CROSS_DEVICE,
    } as unknown as SubmitErrorBodyDto;

    beforeEach(() => {
      service['buildErrorPostBody'] = jest
        .fn()
        .mockReturnValue(errorPostBodyMock);

      requestObjectMock.validatePayload.mockResolvedValue(
        requestPayloadWithState,
      );
    });

    it('should validate the request object payload', async () => {
      // When
      await service.submitError(body);

      // Then
      expect(requestObjectMock.validatePayload).toHaveBeenCalledExactlyOnceWith(
        requestPayloadWithState,
      );
    });

    it('should post the error body built from the request state to the body response uri', async () => {
      // When
      await service.submitError(body);

      // Then
      expect(service['buildErrorPostBody']).toHaveBeenCalledExactlyOnceWith(
        requestPayloadWithState.state,
      );
      expect(responseMock.post).toHaveBeenCalledExactlyOnceWith(
        body.responseUri,
        errorPostBodyMock,
      );
    });
  });

  describe('buildErrorPostBody', () => {
    it('should build an access_denied error body with the provided state', () => {
      // When
      const result = service['buildErrorPostBody']('state-mock');

      // Then
      expect(result).toEqual({
        state: 'state-mock',
        error: Openid4vpAuthorizationError.ACCESS_DENIED,
        // OAuth2 standard parameter name
        error_description: 'User cancelled the authentication',
      });
    });

    it('should omit the state when the request object does not provide one', () => {
      // When
      const result = service['buildErrorPostBody'](undefined);

      // Then
      expect(result).toEqual({
        error: Openid4vpAuthorizationError.ACCESS_DENIED,
        // OAuth2 standard parameter name
        error_description: 'User cancelled the authentication',
      });
    });

    it('should build the provided error and description', () => {
      // When
      const result = service['buildErrorPostBody'](
        'state-mock',
        Openid4vpAuthorizationError.SERVER_ERROR,
        'errorDescriptionMock',
      );

      // Then
      expect(result).toEqual({
        state: 'state-mock',
        error: Openid4vpAuthorizationError.SERVER_ERROR,
        // OAuth2 standard parameter name
        error_description: 'errorDescriptionMock',
      });
    });
  });
});
