import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { getConfigMock } from '@mocks/config';
import { getSessionServiceMock } from '@mocks/session';

import { ISessionRequest } from '../interfaces';
import { SessionService } from '../services';
import { SessionCommitInterceptor } from './session-commit.interceptor';

jest.mock('../helper', () => ({
  extractSessionFromRequest: jest.fn(),
}));

describe('SessionCommitInterceptor', () => {
  let interceptor: SessionCommitInterceptor;

  const reqMock = {
    route: {
      path: '/prefix/some/route',
    },
    sessionId: 'sessionIdValue',
  };

  const httpContextMock = {
    getRequest: jest.fn(),
  };

  const contextMock = {
    switchToHttp: () => httpContextMock,
  } as unknown as ExecutionContext;

  const nextMock = {
    handle: jest.fn(),
  };

  const handleResult = {
    pipe: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();
  const configServiceMock = getConfigMock();

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionCommitInterceptor, SessionService, ConfigService],
    })
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    interceptor = module.get<SessionCommitInterceptor>(
      SessionCommitInterceptor,
    );

    httpContextMock.getRequest.mockReturnValue(reqMock);

    nextMock.handle.mockReturnValue(handleResult);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should call next.handle', async () => {
      // Given

      // When
      await interceptor.intercept(contextMock, nextMock);

      // Then
      expect(nextMock.handle).toHaveBeenCalledTimes(1);
      expect(handleResult.pipe).toHaveBeenCalledTimes(1);
    });
  });

  describe('commit', () => {
    it('should call sessionService.commit', async () => {
      // Given
      configServiceMock.get
        .mockReturnValueOnce({
          urlPrefix: '/prefix',
        })
        .mockReturnValueOnce({
          excludedRoutes: [],
        });

      // When
      await interceptor['commit'](reqMock as unknown as ISessionRequest);

      // Then
      expect(sessionServiceMock.commit).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.commit).toHaveBeenCalledWith({
        sessionId: reqMock.sessionId,
        moduleName: null,
      });
    });

    it('should not call sessionService.commit if route is excluded', async () => {
      // Given
      configServiceMock.get
        .mockReturnValueOnce({
          urlPrefix: '/prefix',
        })
        .mockReturnValueOnce({
          excludedRoutes: ['/some/route'],
        });

      // When
      await interceptor['commit'](reqMock as unknown as ISessionRequest);

      // Then
      expect(sessionServiceMock.commit).not.toHaveBeenCalled();
    });
  });
});
