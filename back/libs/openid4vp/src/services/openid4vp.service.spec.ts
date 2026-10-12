import { of } from 'rxjs';

import { Test, TestingModule } from '@nestjs/testing';

import { SimpleDocumentInterface } from '@fc/mdoc';

import { Openid4vpInteractionDto, Openid4vpRequestConfig } from '../dto';
import { Openid4vpAuthorizationError, Openid4vpFlow } from '../enums';
import { Openid4vpAuthorizationNotFoundException } from '../exceptions';
import { Openid4vpService } from './openid4vp.service';
import { Openid4vpInteractionStatusService } from './openid4vp-interaction-status.service';
import { Openid4vpRequestService } from './openid4vp-request.service';
import { Openid4vpResponseService } from './openid4vp-response.service';
import { Openid4vpSessionService } from './openid4vp-session.service';

describe('Openid4vpService', () => {
  let service: Openid4vpService;

  const requestServiceMock = {
    generateInteractionParams: jest.fn(),
    getRequestById: jest.fn(),
    getAuthorizeRequestUri: jest.fn(),
    createAuthorizeRequestObject: jest.fn(),
  };

  const sessionServiceMock = {
    bindRequestToSession: jest.fn(),
    bindInteractionToBackendId: jest.fn(),
    unbindInteractionFromBackendId: jest.fn(),
    saveInteraction: jest.fn(),
    setAuthorizationRequestObjectAsRead: jest.fn(),
    getInteractionById: jest.fn(),
    getSessionAuthorizationRequests: jest.fn(),
    saveResponse: jest.fn(),
    saveError: jest.fn(),
    getInteractionByBackendId: jest.fn(),
  };

  const responseServiceMock = {
    parseAuthorizationResponse: jest.fn(),
  };

  const interactionStatusServiceMock = {
    subscribeToStatusChanges: jest.fn(),
  };

  const interactionMock = {
    id: 'interactionIdMock',
    credentialQueryId: 'credentialQueryIdMock',
    state: {
      sameDevice: 'sameDeviceStateMock',
      crossDevice: 'crossDeviceStateMock',
    },
    nonce: 'nonceMock',
    iat: 1700000000,
    exp: 1700000600,
    status: 0,
    sessionId: 'sessionIdMock',
  } as unknown as Openid4vpInteractionDto;

  const requestConfigMock = {
    credentialQueryId: 'credentialQueryIdMock',
  } as unknown as Openid4vpRequestConfig;

  const interactionIdMock = 'interactionIdMock';

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Openid4vpService,
        Openid4vpRequestService,
        Openid4vpSessionService,
        Openid4vpResponseService,
        Openid4vpInteractionStatusService,
      ],
    })
      .overrideProvider(Openid4vpRequestService)
      .useValue(requestServiceMock)
      .overrideProvider(Openid4vpSessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(Openid4vpResponseService)
      .useValue(responseServiceMock)
      .overrideProvider(Openid4vpInteractionStatusService)
      .useValue(interactionStatusServiceMock)
      .compile();

    service = module.get<Openid4vpService>(Openid4vpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAuthorizationRequest', () => {
    beforeEach(() => {
      requestServiceMock.generateInteractionParams.mockReturnValue(
        interactionMock,
      );
    });

    it('should generate the interaction params from the request credentialQueryId', async () => {
      // When
      await service.createAuthorizationRequest(
        interactionIdMock,
        requestConfigMock,
      );

      // Then
      expect(
        requestServiceMock.generateInteractionParams,
      ).toHaveBeenCalledExactlyOnceWith(
        interactionIdMock,
        requestConfigMock.credentialQueryId,
      );
    });

    it('should bind the generated interaction id to the session', async () => {
      // When
      await service.createAuthorizationRequest(
        interactionIdMock,
        requestConfigMock,
      );

      // Then
      expect(
        sessionServiceMock.bindRequestToSession,
      ).toHaveBeenCalledExactlyOnceWith(interactionMock.id);
    });

    it('should save the interaction params', async () => {
      // When
      await service.createAuthorizationRequest(
        interactionIdMock,
        requestConfigMock,
      );

      // Then
      expect(
        sessionServiceMock.saveInteraction,
      ).toHaveBeenCalledExactlyOnceWith(interactionMock);
    });

    it('should return the generated interaction id', async () => {
      // When
      const result = await service.createAuthorizationRequest(
        interactionIdMock,
        requestConfigMock,
      );

      // Then
      expect(result).toBe(interactionMock.id);
    });
  });

  describe('getRequestById', () => {
    const credentialQueryId = 'credentialQueryIdMock';

    it('should forward call to the request service', () => {
      // Given
      requestServiceMock.getRequestById.mockReturnValueOnce(requestConfigMock);

      // When
      service.getRequestById(credentialQueryId);

      // Then
      expect(requestServiceMock.getRequestById).toHaveBeenCalledExactlyOnceWith(
        credentialQueryId,
      );
    });

    it('should return the request config when found', () => {
      // Given
      requestServiceMock.getRequestById.mockReturnValueOnce(requestConfigMock);

      // When
      const result = service.getRequestById(credentialQueryId);

      // Then
      expect(result).toBe(requestConfigMock);
    });
  });

  describe('getAuthorizeRequestUri', () => {
    it('should forward call to the request service with the flow', () => {
      // Given
      const uriMock = 'openid4vp://authorize?foo=bar';
      requestServiceMock.getAuthorizeRequestUri.mockReturnValueOnce(uriMock);

      // When
      service.getAuthorizeRequestUri(
        interactionMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(
        requestServiceMock.getAuthorizeRequestUri,
      ).toHaveBeenCalledExactlyOnceWith(
        interactionMock,
        Openid4vpFlow.SAME_DEVICE,
      );
    });

    it('should return the URI provided by the request service', () => {
      // Given
      const uriMock = 'openid4vp://authorize?foo=bar';
      requestServiceMock.getAuthorizeRequestUri.mockReturnValueOnce(uriMock);

      // When
      const result = service.getAuthorizeRequestUri(
        interactionMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(result).toBe(uriMock);
    });
  });

  describe('getRequestObject', () => {
    beforeEach(() => {
      requestServiceMock.getRequestById.mockReturnValue(requestConfigMock);
    });

    it('should resolve the request config from the interaction credentialQueryId', async () => {
      // When
      await service.getRequestObject(
        interactionMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(requestServiceMock.getRequestById).toHaveBeenCalledExactlyOnceWith(
        interactionMock.credentialQueryId,
      );
    });

    it('should create the authorize request object with the interaction, config and flow', async () => {
      // Given
      const requestObjectMock = Symbol('requestObject');
      requestServiceMock.createAuthorizeRequestObject.mockReturnValueOnce(
        requestObjectMock,
      );

      // When
      await service.getRequestObject(
        interactionMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(
        requestServiceMock.createAuthorizeRequestObject,
      ).toHaveBeenCalledExactlyOnceWith(
        interactionMock,
        requestConfigMock,
        Openid4vpFlow.SAME_DEVICE,
      );
    });

    it('should return the request object built by the library', async () => {
      // Given
      const requestObjectMock = Symbol('requestObject');
      requestServiceMock.createAuthorizeRequestObject.mockReturnValueOnce(
        requestObjectMock,
      );

      // When
      const result = await service.getRequestObject(
        interactionMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(result).toBe(requestObjectMock);
    });
  });

  describe('setAuthorizationRequestObjectAsRead', () => {
    it('should delegate to the session service with the flow', async () => {
      // Given
      const expectedResult = Symbol('result');
      sessionServiceMock.setAuthorizationRequestObjectAsRead.mockResolvedValueOnce(
        expectedResult,
      );

      // When
      const result = await service.setAuthorizationRequestObjectAsRead(
        interactionMock,
        Openid4vpFlow.CROSS_DEVICE,
      );

      // Then
      expect(
        sessionServiceMock.setAuthorizationRequestObjectAsRead,
      ).toHaveBeenCalledExactlyOnceWith(
        interactionMock,
        Openid4vpFlow.CROSS_DEVICE,
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe('getFlow', () => {
    // Given
    const interactionMock = {
      state: {
        sameDevice: 'sameDeviceStateMock',
        crossDevice: 'crossDeviceStateMock',
      },
    } as unknown as Openid4vpInteractionDto;

    it('should return the same device flow based on the interaction state', () => {
      // Given
      const stateMock = 'sameDeviceStateMock';

      // When
      const result = service.getFlow(interactionMock, stateMock);

      // Then
      expect(result).toBe(Openid4vpFlow.SAME_DEVICE);
    });

    it('should return the cross device flow based on the interaction state', () => {
      // Given
      const stateMock = 'crossDeviceStateMock';

      // When
      const result = service.getFlow(interactionMock, stateMock);

      // Then
      expect(result).toBe(Openid4vpFlow.CROSS_DEVICE);
    });
  });

  describe('getInteractionById', () => {
    beforeEach(() => {
      sessionServiceMock.getInteractionById.mockResolvedValueOnce(
        interactionMock,
      );
      service['checkInteraction'] = jest.fn();
    });

    it('should return the interaction when found', async () => {
      // When
      const result = await service.getInteractionById(interactionMock.id);

      // Then
      expect(
        sessionServiceMock.getInteractionById,
      ).toHaveBeenCalledExactlyOnceWith(interactionMock.id);
      expect(result).toBe(interactionMock);
    });

    it('should check the interaction', async () => {
      // When
      await service.getInteractionById(interactionMock.id);

      // Then
      expect(service['checkInteraction']).toHaveBeenCalledWith(interactionMock);
    });
  });

  describe('bindInteractionToBackendId', () => {
    // Given
    const backendIdMock = 'backendIdMock';

    it('should delegate to the session service', async () => {
      // When
      await service.bindInteractionToBackendId(backendIdMock, interactionMock);

      // Then
      expect(
        sessionServiceMock.bindInteractionToBackendId,
      ).toHaveBeenCalledExactlyOnceWith(backendIdMock, interactionMock);
    });

    it('should return the backend id', async () => {
      // Given
      sessionServiceMock.bindInteractionToBackendId.mockResolvedValueOnce(
        backendIdMock,
      );

      // When
      const result = await service.bindInteractionToBackendId(
        backendIdMock,
        interactionMock,
      );

      // Then
      expect(result).toBe(backendIdMock);
    });
  });

  describe('unbindInteractionFromBackendId', () => {
    // Given
    const backendIdMock = 'backendIdMock';

    it('should delegate to the session service', async () => {
      // When
      await service.unbindInteractionFromBackendId(backendIdMock);

      // Then
      expect(
        sessionServiceMock.unbindInteractionFromBackendId,
      ).toHaveBeenCalledExactlyOnceWith(backendIdMock);
    });
  });

  describe('getInteractionByBackendId', () => {
    // Given
    const backendIdMock = 'backendIdMock';

    beforeEach(() => {
      sessionServiceMock.getInteractionByBackendId.mockResolvedValueOnce(
        interactionMock,
      );
      service['checkInteraction'] = jest.fn();
    });

    it('should delegate to the session service', async () => {
      // When
      await service.getInteractionByBackendId(backendIdMock);

      // Then
      expect(
        sessionServiceMock.getInteractionByBackendId,
      ).toHaveBeenCalledExactlyOnceWith(backendIdMock);
    });

    it('should check the interaction', async () => {
      // When
      await service.getInteractionByBackendId(backendIdMock);

      // Then
      expect(service['checkInteraction']).toHaveBeenCalledExactlyOnceWith(
        interactionMock,
      );
    });

    it('should return the interaction when found', async () => {
      // When
      const result = await service.getInteractionByBackendId(backendIdMock);

      // Then
      expect(result).toBe(interactionMock);
    });
  });

  describe('getUserInteractionById', () => {
    beforeEach(() => {
      service['checkInteraction'] = jest.fn();
    });

    it('should not call getInteractionById when the id is not in the session interactions', async () => {
      // Given
      sessionServiceMock.getSessionAuthorizationRequests.mockReturnValueOnce(
        [],
      );

      // When
      await expect(
        service.getUserInteractionById(interactionMock.id),
      ).rejects.toThrow(Openid4vpAuthorizationNotFoundException);

      // Then
      expect(sessionServiceMock.getInteractionById).not.toHaveBeenCalled();
    });

    it('should forward call to getInteractionById when the id is in the session interactions', async () => {
      // Given
      sessionServiceMock.getSessionAuthorizationRequests.mockReturnValueOnce([
        interactionMock.id,
      ]);
      sessionServiceMock.getInteractionById.mockResolvedValueOnce(
        interactionMock,
      );

      // When
      await service.getUserInteractionById(interactionMock.id);

      // Then
      expect(
        sessionServiceMock.getInteractionById,
      ).toHaveBeenCalledExactlyOnceWith(interactionMock.id);
    });

    it('should return the interaction when the id is in the session interactions', async () => {
      // Given
      sessionServiceMock.getSessionAuthorizationRequests.mockReturnValueOnce([
        interactionMock.id,
      ]);
      sessionServiceMock.getInteractionById.mockResolvedValueOnce(
        interactionMock,
      );

      // When
      const result = await service.getUserInteractionById(interactionMock.id);

      // Then
      expect(result).toBe(interactionMock);
    });
  });

  describe('parseResponse', () => {
    const responseMock = { vp_token: 'tokenMock' } as Record<string, unknown>;
    const authorizationRequestPayloadMock = Symbol(
      'authorizationRequestPayload',
    );
    const requestObjectMock = {
      authorizationRequestPayload: authorizationRequestPayloadMock,
    };
    const documentsMock = [{ docType: 'doc1' }];

    beforeEach(() => {
      service.getRequestObject = jest.fn().mockReturnValue(requestObjectMock);

      responseServiceMock.parseAuthorizationResponse.mockResolvedValue(
        documentsMock,
      );
    });

    it('should build the request object from the interaction and flow', async () => {
      // When
      await service.parseResponse(
        responseMock,
        interactionMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(service.getRequestObject).toHaveBeenCalledExactlyOnceWith(
        interactionMock,
        Openid4vpFlow.SAME_DEVICE,
      );
    });

    it('should delegate the parsing to the response service with the request payload and the presentation id as credential id', async () => {
      // When
      await service.parseResponse(
        responseMock,
        interactionMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(
        responseServiceMock.parseAuthorizationResponse,
      ).toHaveBeenCalledExactlyOnceWith(
        responseMock,
        authorizationRequestPayloadMock,
        interactionMock.credentialQueryId,
      );
    });

    it('should return the parsed documents', async () => {
      // When
      const result = await service.parseResponse(
        responseMock,
        interactionMock,
        Openid4vpFlow.SAME_DEVICE,
      );

      // Then
      expect(result).toBe(documentsMock);
    });
  });

  describe('saveResponse', () => {
    it('should delegate to the session service', async () => {
      // Given
      const responseMock = [
        { docType: 'foo', claims: { foo: 'bar' } },
      ] as SimpleDocumentInterface<unknown>[];
      const expectedResult = Symbol('result');
      sessionServiceMock.saveResponse.mockResolvedValueOnce(expectedResult);

      // When
      const result = await service.saveResponse(interactionMock, responseMock);

      // Then
      expect(sessionServiceMock.saveResponse).toHaveBeenCalledExactlyOnceWith(
        interactionMock,
        responseMock,
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe('saveError', () => {
    it('should delegate to the session service', async () => {
      // Given
      const errorMock = Openid4vpAuthorizationError.ACCESS_DENIED;
      const errorDescriptionMock = 'errorDescriptionMock';
      const expectedResult = Symbol('result');
      sessionServiceMock.saveError.mockResolvedValueOnce(expectedResult);

      // When
      const result = await service.saveError(
        interactionMock,
        errorMock,
        errorDescriptionMock,
      );

      // Then
      expect(sessionServiceMock.saveError).toHaveBeenCalledExactlyOnceWith(
        interactionMock,
        errorMock,
        errorDescriptionMock,
      );
      expect(result).toBe(expectedResult);
    });
  });

  describe('checkInteraction', () => {
    it('should throw when the interaction is not found', () => {
      //When / When
      expect(() => service['checkInteraction'](undefined)).toThrow(
        Openid4vpAuthorizationNotFoundException,
      );
    });

    it('should throw Openid4vpAuthorizationNotFoundException when the interaction is expired', () => {
      // Given
      const expiredInteractionMock = {
        ...interactionMock,
        exp: Date.now() / 1000 - 10,
      };

      // When
      expect(() => service['checkInteraction'](expiredInteractionMock)).toThrow(
        Openid4vpAuthorizationNotFoundException,
      );
    });

    it('should not throw when the interaction is not expired', () => {
      // Given
      const notExpiredInteractionMock = {
        ...interactionMock,
        exp: Date.now() / 1000 + 10,
      };

      // Then / When
      expect(() =>
        service['checkInteraction'](notExpiredInteractionMock),
      ).not.toThrow();
    });
  });

  describe('subscribeToStatusChanges', () => {
    it('should delegate to interactionStatus.subscribeToStatusChanges', () => {
      // Given
      const expectedObservable$ = of(0);
      interactionStatusServiceMock.subscribeToStatusChanges.mockReturnValue(
        expectedObservable$,
      );

      // When
      const result = service.subscribeToStatusChanges(interactionMock.id);

      // Then
      expect(
        interactionStatusServiceMock.subscribeToStatusChanges,
      ).toHaveBeenCalledExactlyOnceWith(interactionMock.id);
      expect(result).toBe(expectedObservable$);
    });
  });
});
