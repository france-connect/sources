import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { SimpleDocumentInterface } from '@fc/mdoc';
import { RedisService } from '@fc/redis';
import { SessionService } from '@fc/session';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';
import { getRedisServiceMock, getRedisServiceMultiMock } from '@mocks/redis';
import { getSessionServiceMock } from '@mocks/session';

import { Openid4vpInteractionDto } from '../dto';
import {
  Openid4vpAuthorizationError,
  Openid4vpInteractionStatus,
} from '../enums';
import { Openid4vpAuthorizationNotFoundException } from '../exceptions';
import { Openid4vpInteractionStatusService } from './openid4vp-interaction-status.service';
import { Openid4vpSessionService } from './openid4vp-session.service';

describe('Openid4vpSessionService', () => {
  let service: Openid4vpSessionService;

  const sessionMock = getSessionServiceMock();
  const redisMock = getRedisServiceMock();
  const multiMock = getRedisServiceMultiMock();
  const configMock = getConfigMock();
  const loggerMock = getLoggerMock();
  const interactionStatusMock = { publishStatus: jest.fn() };

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

  const idRedisKey = `oid4vp:req:${interactionMock.id}`;
  const stateRedisKey = `oid4vp:state:${interactionMock.state}`;

  const openid4vpConfigMock = {
    relayingParty: {
      interactionTtl: 600,
      responseDelay: 60,
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Openid4vpSessionService,
        SessionService,
        RedisService,
        ConfigService,
        LoggerService,
        Openid4vpInteractionStatusService,
      ],
    })
      .overrideProvider(SessionService)
      .useValue(sessionMock)
      .overrideProvider(RedisService)
      .useValue(redisMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(Openid4vpInteractionStatusService)
      .useValue(interactionStatusMock)
      .compile();

    service = module.get<Openid4vpSessionService>(Openid4vpSessionService);

    redisMock.client.multi.mockReturnValue(multiMock);
    configMock.get.mockReturnValue(openid4vpConfigMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('bindRequestToSession', () => {
    it('should append the new interaction id to the existing list and persist it in the session', () => {
      // Given
      sessionMock.get.mockReturnValueOnce({ interactions: ['existingIdMock'] });

      // When
      service.bindRequestToSession('newIdMock');

      // Then
      expect(sessionMock.set).toHaveBeenCalledExactlyOnceWith('Openid4vp', {
        interactions: ['existingIdMock', 'newIdMock'],
      });
    });

    it('should create a fresh interactions list when the session is empty', () => {
      // Given
      sessionMock.get.mockReturnValueOnce(undefined);

      // When
      service.bindRequestToSession('newIdMock');

      // Then
      expect(sessionMock.set).toHaveBeenCalledExactlyOnceWith('Openid4vp', {
        interactions: ['newIdMock'],
      });
    });
  });

  describe('getSessionAuthorizationRequests', () => {
    it('should return the interactions stored in the session', () => {
      // Given
      const interactions = ['id1Mock', 'id2Mock'];
      sessionMock.get.mockReturnValueOnce({ interactions });

      // When
      const result = service.getSessionAuthorizationRequests();

      // Then
      expect(sessionMock.get).toHaveBeenCalledExactlyOnceWith('Openid4vp');
      expect(result).toBe(interactions);
    });

    it('should return an empty array when the session is empty', () => {
      // Given
      sessionMock.get.mockReturnValueOnce(undefined);

      // When
      const result = service.getSessionAuthorizationRequests();

      // Then
      expect(result).toEqual([]);
    });
  });

  describe('saveInteraction', () => {
    it('should persist the serialized interaction at the interaction redis key', async () => {
      // When
      await service.saveInteraction(interactionMock);

      // Then
      expect(multiMock.set).toHaveBeenCalledExactlyOnceWith(
        idRedisKey,
        JSON.stringify(interactionMock),
      );
    });

    it('should configure the redis key TTL with the configured interactionTtl', async () => {
      // When
      await service.saveInteraction(interactionMock);

      // Then
      expect(multiMock.expire).toHaveBeenCalledExactlyOnceWith(
        idRedisKey,
        openid4vpConfigMock.relayingParty.interactionTtl,
      );
    });

    it('should execute the redis transaction', async () => {
      // When
      await service.saveInteraction(interactionMock);

      // Then
      expect(multiMock.exec).toHaveBeenCalledExactlyOnceWith();
    });
  });

  describe('setAuthorizationRequestObjectAsRead', () => {
    it('should update the interaction status to REQUEST_OBJECT_PROVIDED on the interaction key', async () => {
      // When
      await service.setAuthorizationRequestObjectAsRead(interactionMock);

      // Then
      expect(multiMock.set).toHaveBeenCalledWith(
        idRedisKey,
        JSON.stringify({
          ...interactionMock,
          status: Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED,
        }),
      );
    });

    it('should configure the interaction key TTL with the responseDelay', async () => {
      // When
      await service.setAuthorizationRequestObjectAsRead(interactionMock);

      // Then
      expect(multiMock.expire).toHaveBeenCalledWith(
        idRedisKey,
        openid4vpConfigMock.relayingParty.responseDelay,
      );
    });

    it('should bind the state key to the interaction id', async () => {
      // When
      await service.setAuthorizationRequestObjectAsRead(interactionMock);

      // Then
      expect(multiMock.set).toHaveBeenCalledWith(
        stateRedisKey,
        interactionMock.id,
      );
    });

    it('should configure the state key TTL with the responseDelay', async () => {
      // When
      await service.setAuthorizationRequestObjectAsRead(interactionMock);

      // Then
      expect(multiMock.expire).toHaveBeenCalledWith(
        stateRedisKey,
        openid4vpConfigMock.relayingParty.responseDelay,
      );
    });

    it('should execute the redis transaction', async () => {
      // When
      await service.setAuthorizationRequestObjectAsRead(interactionMock);

      // Then
      expect(multiMock.exec).toHaveBeenCalledExactlyOnceWith();
    });

    it('should publish the REQUEST_OBJECT_PROVIDED status via interactionStatus service', async () => {
      // When
      await service.setAuthorizationRequestObjectAsRead(interactionMock);

      // Then
      expect(
        interactionStatusMock.publishStatus,
      ).toHaveBeenCalledExactlyOnceWith(
        interactionMock.id,
        Openid4vpInteractionStatus.REQUEST_OBJECT_PROVIDED,
      );
    });
  });

  describe('bindInteractionToBackendId', () => {
    // Given
    const backendIdMock = 'backendIdMock';
    const backendIdRedisKey = `oid4vp:backend:${backendIdMock}`;

    it('should persist the interaction id at the backend id redis key', async () => {
      // When
      await service.bindInteractionToBackendId(backendIdMock, interactionMock);

      // Then
      expect(multiMock.set).toHaveBeenCalledExactlyOnceWith(
        backendIdRedisKey,
        interactionMock.id,
      );
    });

    it('should configure the backend id key TTL with the responseDelay', async () => {
      // When
      await service.bindInteractionToBackendId(backendIdMock, interactionMock);

      // Then
      expect(multiMock.expire).toHaveBeenCalledExactlyOnceWith(
        backendIdRedisKey,
        openid4vpConfigMock.relayingParty.responseDelay,
      );
    });

    it('should execute the redis transaction', async () => {
      // When
      await service.bindInteractionToBackendId(backendIdMock, interactionMock);

      // Then
      expect(multiMock.exec).toHaveBeenCalledExactlyOnceWith();
    });
  });

  describe('unbindInteractionFromBackendId', () => {
    // Given
    const backendIdMock = 'backendIdMock';
    const backendIdRedisKey = `oid4vp:backend:${backendIdMock}`;

    it('should delete the interaction id from the backend id redis key', async () => {
      // When
      await service.unbindInteractionFromBackendId(backendIdMock);

      // Then
      expect(redisMock.client.del).toHaveBeenCalledExactlyOnceWith(
        backendIdRedisKey,
      );
    });
  });

  describe('getInteractionByBackendId', () => {
    // Given
    const backendIdMock = 'backendIdMock';
    const interactionIdMock = 'interactionIdMock';
    const backendIdRedisKey = `oid4vp:backend:${backendIdMock}`;

    beforeEach(() => {
      redisMock.client.get.mockResolvedValue(interactionIdMock);
      service.getInteractionById = jest.fn().mockResolvedValue(interactionMock);
    });

    it('should fetch the interaction id from the backend id key', async () => {
      // Given

      // When
      await service.getInteractionByBackendId(backendIdMock);

      // Then
      expect(redisMock.client.get).toHaveBeenCalledExactlyOnceWith(
        backendIdRedisKey,
      );
    });

    it('should fetch the interaction from the interaction with the interaction id fetched from redis', async () => {
      // Given
      redisMock.client.get.mockResolvedValueOnce(interactionIdMock);

      // When
      await service.getInteractionByBackendId(backendIdMock);

      // Then
      expect(service.getInteractionById).toHaveBeenCalledExactlyOnceWith(
        interactionIdMock,
      );
    });

    it('should throw Openid4vpAuthorizationNotFoundException when the interaction is not found', async () => {
      // Given
      redisMock.client.get.mockResolvedValueOnce(null);

      // When / Then
      await expect(
        service.getInteractionByBackendId(backendIdMock),
      ).rejects.toThrow(Openid4vpAuthorizationNotFoundException);
    });
  });

  describe('getInteractionByState', () => {
    beforeEach(() => {
      service.getInteractionById = jest.fn().mockResolvedValue(interactionMock);
    });
    it('should fetch the interaction id from the state key', async () => {
      // Given
      redisMock.client.get.mockResolvedValueOnce(interactionMock.id);

      // When
      await service.getInteractionByState(interactionMock.state);

      // Then
      expect(redisMock.client.get).toHaveBeenCalledExactlyOnceWith(
        stateRedisKey,
      );
    });

    it('should throw Openid4vpAuthorizationNotFoundException when the interaction is not found', async () => {
      // Given
      redisMock.client.get.mockResolvedValueOnce(null);

      // When / Then
      await expect(
        service.getInteractionByState(interactionMock.state),
      ).rejects.toThrow(Openid4vpAuthorizationNotFoundException);
    });

    it('should delegate to getInteractionById with the resolved id', async () => {
      // Given
      redisMock.client.get.mockResolvedValueOnce(interactionMock.id);

      // When
      const result = await service.getInteractionByState(interactionMock.state);

      // Then
      expect(service.getInteractionById).toHaveBeenCalledExactlyOnceWith(
        interactionMock.id,
      );
      expect(result).toBe(interactionMock);
    });
  });

  describe('getInteractionById', () => {
    it('should fetch the interaction from the interaction redis key', async () => {
      // Given
      redisMock.client.get.mockResolvedValueOnce(
        JSON.stringify(interactionMock),
      );

      // When
      await service.getInteractionById(interactionMock.id);

      // Then
      expect(redisMock.client.get).toHaveBeenCalledExactlyOnceWith(idRedisKey);
    });

    it('should return the parsed interaction', async () => {
      // Given
      redisMock.client.get.mockResolvedValueOnce(
        JSON.stringify(interactionMock),
      );

      // When
      const result = await service.getInteractionById(interactionMock.id);

      // Then
      expect(result).toEqual(interactionMock);
    });
  });

  describe('saveResponse', () => {
    const responseMock = [
      { docType: 'foo', claims: { foo: 'bar' } },
    ] as SimpleDocumentInterface<{ foo: string }>[];

    beforeEach(() => {
      service['persistTerminalState'] = jest.fn();
    });

    it('should persist the interaction enriched with the response and the RESPONSE_RECEIVED status', async () => {
      // When
      await service.saveResponse(interactionMock, responseMock);

      // Then
      expect(service['persistTerminalState']).toHaveBeenCalledExactlyOnceWith({
        ...interactionMock,
        response: responseMock,
        status: Openid4vpInteractionStatus.RESPONSE_RECEIVED,
      });
    });
  });

  describe('saveError', () => {
    const errorMock = Openid4vpAuthorizationError.ACCESS_DENIED;
    const errorDescriptionMock = 'errorDescriptionMock';

    beforeEach(() => {
      service['persistTerminalState'] = jest.fn();
    });

    it('should persist the interaction enriched with the error and the ERROR status', async () => {
      // When
      await service.saveError(interactionMock, errorMock, errorDescriptionMock);

      // Then
      expect(service['persistTerminalState']).toHaveBeenCalledExactlyOnceWith({
        ...interactionMock,
        error: errorMock,
        errorDescription: errorDescriptionMock,
        status: Openid4vpInteractionStatus.ERROR,
      });
    });
  });

  describe('persistTerminalState', () => {
    const terminalInteractionMock: Openid4vpInteractionDto = {
      ...interactionMock,
      status: Openid4vpInteractionStatus.RESPONSE_RECEIVED,
    };

    it('should persist the interaction as provided', async () => {
      // When
      await service['persistTerminalState'](terminalInteractionMock);

      // Then
      expect(multiMock.set).toHaveBeenCalledExactlyOnceWith(
        idRedisKey,
        JSON.stringify(terminalInteractionMock),
      );
    });

    it('should configure the interaction key TTL with the interactionTtl', async () => {
      // When
      await service['persistTerminalState'](terminalInteractionMock);

      // Then
      expect(multiMock.expire).toHaveBeenCalledExactlyOnceWith(
        idRedisKey,
        openid4vpConfigMock.relayingParty.interactionTtl,
      );
    });

    it('should delete the state key', async () => {
      // When
      await service['persistTerminalState'](terminalInteractionMock);

      // Then
      expect(multiMock.del).toHaveBeenCalledExactlyOnceWith(stateRedisKey);
    });

    it('should execute the redis transaction', async () => {
      // When
      await service['persistTerminalState'](terminalInteractionMock);

      // Then
      expect(multiMock.exec).toHaveBeenCalledExactlyOnceWith();
    });

    it('should publish the interaction status via interactionStatus service', async () => {
      // When
      await service['persistTerminalState'](terminalInteractionMock);

      // Then
      expect(
        interactionStatusMock.publishStatus,
      ).toHaveBeenCalledExactlyOnceWith(
        terminalInteractionMock.id,
        terminalInteractionMock.status,
      );
    });
  });
});
