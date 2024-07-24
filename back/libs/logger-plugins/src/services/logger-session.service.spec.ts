import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { LoggerSessionService } from './logger-session.service';

describe('LoggerSessionService', () => {
  let service: LoggerSessionService;

  const moduleRefMock = {
    get: jest.fn(),
  };

  const sessionMock = getSessionServiceMock();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerSessionService],
    })
      .overrideProvider(ModuleRef)
      .useValue(moduleRefMock)
      .compile();

    service = module.get<LoggerSessionService>(LoggerSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getContext', () => {
    const sessionId = Symbol('sessionId');
    const browsingSessionId = Symbol('browsingSessionId');

    beforeEach(() => {
      moduleRefMock.get.mockReturnValue(sessionMock);

      sessionMock.getId.mockReturnValue(sessionId);
      sessionMock.get.mockReturnValue({ browsingSessionId });
    });

    it('should fetch SessionService from moduleRef', () => {
      // When
      service.getContext();

      // Then
      expect(moduleRefMock.get).toHaveBeenCalledExactlyOnceWith(
        SessionService,
        {
          strict: false,
        },
      );
    });

    it('should call sessionService.getId', () => {
      // When
      service.getContext();

      // Then
      expect(sessionMock.getId).toHaveBeenCalledOnce();
    });

    it('should call sessionService.get', () => {
      // When
      service.getContext();

      // Then
      expect(sessionMock.get).toHaveBeenCalledExactlyOnceWith('OidcClient');
    });

    it('should return sessionId and browsingSessionId', () => {
      // When
      const result = service.getContext();

      // Then
      expect(result).toEqual({
        sessionId,
        browsingSessionId,
      });
    });

    it('should return undefined for browsingSessionId if not set session part is found', () => {
      // Given
      sessionMock.get.mockReturnValue(undefined);

      // When
      const result = service.getContext();

      // Then
      expect(result).toEqual({
        sessionId,
        browsingSessionId: undefined,
      });
    });
  });
});
