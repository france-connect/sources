import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';
import { OidcSession } from '@fc/oidc';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { SessionService } from '@fc/session';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { CoreFcpAidantsConnectAuthorizationHandler } from './core-fcp-aidants-connect-authorize.handler';

describe('CoreFcpAidantsConnectAuthorizationHandler', () => {
  let service: CoreFcpAidantsConnectAuthorizationHandler;

  const loggerServiceMock = getLoggerMock();
  const oidcSessionServiceMock = getSessionServiceMock();

  const serviceProviderServiceMock = {
    getById: jest.fn(),
  };

  const repScopeMock = ['scope1', 'scope2'];
  const spIdMock = 'spIdMockValue';
  const oidcSessionMock: OidcSession = {
    spId: spIdMock,
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreFcpAidantsConnectAuthorizationHandler,
        LoggerService,
        ServiceProviderAdapterMongoService,
        SessionService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(oidcSessionServiceMock)
      .overrideProvider(ServiceProviderAdapterMongoService)
      .useValue(serviceProviderServiceMock)
      .compile();

    service = module.get<CoreFcpAidantsConnectAuthorizationHandler>(
      CoreFcpAidantsConnectAuthorizationHandler,
    );

    oidcSessionServiceMock.get.mockReturnValue(oidcSessionMock);
    serviceProviderServiceMock.getById.mockResolvedValue({
      rep_scope: repScopeMock,
    });
  });

  describe('handle()', () => {
    it('should handle authorization parameters and return updated parameters', async () => {
      // Given
      const oidcParams = {
        claims: { id_token: {} },
      };

      // When
      const result = await service.handle(oidcParams);

      // Then
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(
        'getInteraction: ##### core-fcp-aidants-connect-authorization',
      );
      expect(oidcSessionServiceMock.get).toHaveBeenCalledWith('OidcClient');
      expect(serviceProviderServiceMock.getById).toHaveBeenCalledWith(spIdMock);

      expect(result).toEqual({
        claims: {
          id_token: {
            rep_scope: {
              essential: true,
              values: repScopeMock,
            },
          },
        },
      });
    });
  });
});
