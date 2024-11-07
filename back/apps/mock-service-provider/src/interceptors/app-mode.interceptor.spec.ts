import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { AppMode } from '../enums';
import { AppModeInterceptor } from '.';

describe('AppModeInterceptor', () => {
  let interceptor: AppModeInterceptor;

  const httpContextMock = {
    getRequest: jest.fn(),
  };

  const contextMock = {
    switchToHttp: () => httpContextMock,
  } as unknown as ExecutionContext;

  const reqMock = {
    query: {
      mode: 'advanced',
    },
  };

  const nextMock = {
    handle: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppModeInterceptor, SessionService],
    })
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    interceptor = module.get<AppModeInterceptor>(AppModeInterceptor);

    jest.resetAllMocks();
    httpContextMock.getRequest.mockReturnValue(reqMock);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should call setAppMode with the query mode', async () => {
      // Given
      interceptor['setAppMode'] = jest.fn();
      // When
      await interceptor.intercept(contextMock, nextMock);
      // Then
      expect(interceptor['setAppMode']).toHaveBeenCalledTimes(1);
      expect(interceptor['setAppMode']).toHaveBeenCalledWith(
        reqMock.query.mode,
      );
    });

    it('should call setAppMode with the empty query mode if missing', async () => {
      // Given
      interceptor['setAppMode'] = jest.fn();
      // Given
      const emptyQueryReqMock = {
        query: {},
      };
      httpContextMock.getRequest.mockReturnValue(emptyQueryReqMock);
      // When
      await interceptor.intercept(contextMock, nextMock);
      // Then
      expect(interceptor['setAppMode']).toHaveBeenCalledTimes(1);
      expect(interceptor['setAppMode']).toHaveBeenCalledWith('');
    });
  });

  describe('setAppMode', () => {
    it('should get the App session', async () => {
      // When
      await interceptor['setAppMode']('requestMode');
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith('App');
    });

    it('should set the App mode with the request mode if truthy', async () => {
      // Given
      const requestMode = 'requestMode';
      const sessionMode = 'sessionMode';
      const sessionData = {
        mode: sessionMode,
      };
      sessionServiceMock.get.mockReturnValueOnce(sessionData);

      // When
      await interceptor['setAppMode'](requestMode);
      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith(
        'App',
        'mode',
        requestMode,
      );
    });

    it('should set the App mode with the session mode if request mode is not truthy', async () => {
      // Given
      const emptyRequestMode = '';
      const sessionMode = 'sessionMode';
      const sessionData = {
        mode: sessionMode,
      };
      sessionServiceMock.get.mockReturnValueOnce(sessionData);

      // When
      await interceptor['setAppMode'](emptyRequestMode);
      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith(
        'App',
        'mode',
        sessionMode,
      );
    });

    it('should set the App mode to basic if both request mode and session mode are not truthy', async () => {
      // Given
      const emptyRequestMode = '';
      const emptySessionMode = '';
      const sessionData = {
        mode: emptySessionMode,
      };
      sessionServiceMock.get.mockReturnValueOnce(sessionData);

      // When
      await interceptor['setAppMode'](emptyRequestMode);
      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith(
        'App',
        'mode',
        AppMode.BASIC,
      );
    });
  });
});
