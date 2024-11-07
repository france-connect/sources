import { Response } from 'express';

import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { OidcSession } from '@fc/oidc';
import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { MockServiceProviderRoutes } from '../enums';
import { AuthRedirectInterceptor } from '.';

describe('AuthRedirectInterceptor', () => {
  let interceptor: AuthRedirectInterceptor;

  const httpContextMock = {
    getResponse: jest.fn(),
  };

  const contextMock = {
    switchToHttp: () => httpContextMock,
  } as unknown as ExecutionContext;

  const resMock = {
    redirect: jest.fn(),
  } as unknown as Response;

  const nextMock = {
    handle: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();
  const sessionOidcDataMock = {
    idpNonce: 'idpNonceMock',
    idpState: 'idpStateMock',
    idpIdentity: 'idpIdentityMock',
    idpIdToken: 'idpIdTokenMock',
    idpAccessToken: 'idpAccessTokenMock',
    idpId: 'idpIdMock',
  } as unknown as OidcSession;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthRedirectInterceptor, SessionService],
    })
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    interceptor = module.get<AuthRedirectInterceptor>(AuthRedirectInterceptor);

    jest.resetAllMocks();
    httpContextMock.getResponse.mockReturnValue(resMock);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should call redirectIfNotConnected with the response and oidcClient', () => {
      // Given
      interceptor['redirectIfNotConnected'] = jest.fn();
      sessionServiceMock.get.mockReturnValueOnce(sessionOidcDataMock);
      // When
      interceptor.intercept(contextMock, nextMock);
      // Then
      expect(interceptor['redirectIfNotConnected']).toHaveBeenCalledTimes(1);
      expect(interceptor['redirectIfNotConnected']).toHaveBeenCalledWith(
        resMock,
        sessionOidcDataMock,
      );
    });
  });

  describe('redirectIfNotConnected', () => {
    it('should redirect to login route if no session found', () => {
      // When
      interceptor['redirectIfNotConnected'](resMock, undefined);
      // Then
      expect(resMock.redirect).toHaveBeenCalledTimes(1);
      expect(resMock.redirect).toHaveBeenCalledWith(
        MockServiceProviderRoutes.LOGIN,
      );
    });

    it('should redirect to login route if not connected', () => {
      // When
      interceptor['redirectIfNotConnected'](resMock, {});
      // Then
      expect(resMock.redirect).toHaveBeenCalledTimes(1);
      expect(resMock.redirect).toHaveBeenCalledWith(
        MockServiceProviderRoutes.LOGIN,
      );
    });

    it('should not call redirect if connected', () => {
      // When
      interceptor['redirectIfNotConnected'](resMock, sessionOidcDataMock);
      // Then
      expect(resMock.redirect).toHaveBeenCalledTimes(0);
    });
  });
});
