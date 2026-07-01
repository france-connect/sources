import { Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import {
  OidcCtx,
  OidcProviderMiddlewareStep,
  OidcProviderRoutes,
  OidcProviderService,
} from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { OidcMiddlewareService } from './oidc-middleware.service';

const sessionServiceMock = getSessionServiceMock();

const oidcProviderServiceMock = {
  registerMiddleware: jest.fn(),
};

describe('OidcMiddlewareService', () => {
  let service: OidcMiddlewareService;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [OidcMiddlewareService, OidcProviderService, SessionService],
    })
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    service = module.get<OidcMiddlewareService>(OidcMiddlewareService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onApplicationBootstrap()', () => {
    it('should register the afterUserinfo middleware on USERINFO route', () => {
      // When
      service.onApplicationBootstrap();

      // Then
      expect(
        oidcProviderServiceMock.registerMiddleware,
      ).toHaveBeenCalledExactlyOnceWith(
        OidcProviderMiddlewareStep.AFTER,
        OidcProviderRoutes.USERINFO,
        expect.any(Function),
      );
    });
  });

  describe('afterUserinfoMiddleware()', () => {
    it('should call sessionService.destroy with the response cast from ctx', async () => {
      // Given
      const resMock = {} as Response;
      const ctxMock = { res: resMock } as unknown as OidcCtx;

      // When
      await service['afterUserinfoMiddleware'](ctxMock);

      // Then
      expect(sessionServiceMock.destroy).toHaveBeenCalledExactlyOnceWith(
        resMock,
      );
    });
  });
});
