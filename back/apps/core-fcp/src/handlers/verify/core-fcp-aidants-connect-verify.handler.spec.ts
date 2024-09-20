import { Test, TestingModule } from '@nestjs/testing';

import { AccountService } from '@fc/account';
import { ConfigService } from '@fc/config';
import { CoreAccountService, CoreAcrService } from '@fc/core';
import { CoreFcpInvalidRepScopeException } from '@fc/core-fcp/exceptions';
import { CryptographyFcpService } from '@fc/cryptography-fcp';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { OidcSession } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
import { RnippService } from '@fc/rnipp';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { SessionService } from '@fc/session';
import {
  TrackedEventContextInterface,
  TrackedEventInterface,
  TrackingService,
} from '@fc/tracking';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { CoreFcpAidantsConnectVerifyHandler } from './core-fcp-aidants-connect-verify.handler';
import { CoreFcpDefaultVerifyHandler } from './core-fcp-default-verify.handler';

describe('CoreFcpDefaultVerifyHandler', () => {
  let service: CoreFcpAidantsConnectVerifyHandler;

  const loggerServiceMock = getLoggerMock();
  const oidcSessionServiceMock = getSessionServiceMock();

  const serviceProviderServiceMock = {
    getById: jest.fn(),
  };

  const trackingServiceMock: TrackingService = {
    track: jest.fn(),
    TrackedEventsMap: {
      FC_VALID_REP_SCOPE: Symbol(
        'FC_VALID_REP_SCOPE',
      ) as unknown as TrackedEventInterface,
      FC_INVALID_REP_SCOPE: Symbol(
        'FC_INVALID_REP_SCOPE',
      ) as unknown as TrackedEventInterface,
    },
  } as unknown as TrackingService;

  const spIdMock = 'spIdMockValue';
  const repScopeMock = ['scope1', 'scope2'];
  const idpRepresentativeScopeMock = ['scope1', 'scope2'];
  const oidcSessionMock: OidcSession = {
    spId: spIdMock,
    idpRepresentativeScope: idpRepresentativeScopeMock,
  };

  const trackingContextMock = {} as unknown as TrackedEventContextInterface;
  const coreAccountServiceMock = {
    computeFederation: jest.fn(),
    checkIfIdpIsBlockedForAccount: jest.fn(),
  };
  const coreAcrServiceMock = {
    checkIfAcrIsValid: jest.fn(),
  };
  const rnippServiceMock = {
    check: jest.fn(),
  };
  const cryptographyFcpServiceMock = {
    computeSubV1: jest.fn(),
    computeIdentityHash: jest.fn(),
  };
  const accountServiceMock = {
    getAccountByIdentityHash: jest.fn(),
  };
  const identityProviderAdapterMock = {
    getById: jest.fn(),
  };
  const oidcAcrMock = {
    getInteractionAcr: jest.fn(),
  };
  const configServiceMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        CoreAccountService,
        CoreAcrService,
        CoreFcpAidantsConnectVerifyHandler,
        LoggerService,
        SessionService,
        RnippService,
        TrackingService,
        ServiceProviderAdapterMongoService,
        IdentityProviderAdapterMongoService,
        CryptographyFcpService,
        AccountService,
        OidcAcrService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(oidcSessionServiceMock)
      .overrideProvider(ServiceProviderAdapterMongoService)
      .useValue(serviceProviderServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(CoreAccountService)
      .useValue(coreAccountServiceMock)
      .overrideProvider(CoreAcrService)
      .useValue(coreAcrServiceMock)
      .overrideProvider(RnippService)
      .useValue(rnippServiceMock)
      .overrideProvider(CryptographyFcpService)
      .useValue(cryptographyFcpServiceMock)
      .overrideProvider(AccountService)
      .useValue(accountServiceMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderAdapterMock)
      .overrideProvider(OidcAcrService)
      .useValue(oidcAcrMock)
      .compile();

    service = module.get<CoreFcpAidantsConnectVerifyHandler>(
      CoreFcpAidantsConnectVerifyHandler,
    );

    oidcSessionServiceMock.get.mockReturnValue(oidcSessionMock);

    identityProviderAdapterMock.getById.mockResolvedValue({
      allowedAcr: 'allowedAcr',
    });
    coreAccountServiceMock.computeFederation.mockResolvedValue('accountIdMock');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    beforeEach(() => {
      service['setTrackEvent'] = jest.fn();
      service['hasAtLeastOneMatchingRepresentativeScope'] = jest
        .fn()
        .mockReturnValueOnce(true);
    });

    it('should throw CoreFcpInvalidRepScopeException and track invalid scope event if idpRepresentativeScope does not match spRepresentativeScope', async () => {
      // Given
      serviceProviderServiceMock.getById.mockResolvedValue({
        rep_scope: ['scope3'],
      });
      service['hasAtLeastOneMatchingRepresentativeScope'] = jest
        .fn()
        .mockReturnValueOnce(false);

      // When
      await expect(
        service.handle({
          sessionOidc: oidcSessionServiceMock,
          trackingContext: trackingContextMock,
        }),
      ).rejects.toThrow(CoreFcpInvalidRepScopeException);

      // Then
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(
        'getConsent service: ##### core-fcp-aidants-connect-verify',
      );
      expect(service['setTrackEvent']).toHaveBeenCalledWith(
        oidcSessionServiceMock,
        trackingContextMock,
        oidcSessionMock.idpRepresentativeScope,
        trackingServiceMock.TrackedEventsMap.FC_INVALID_REP_SCOPE,
      );
    });

    it('should not throw an exception and should track valid scope event if idpRepresentativeScope matches spRepresentativeScope', async () => {
      // Given
      serviceProviderServiceMock.getById.mockResolvedValue({
        rep_scope: repScopeMock,
      });

      // When
      await service.handle({
        sessionOidc: oidcSessionServiceMock,
        trackingContext: trackingContextMock,
      });

      // Then
      expect(service['setTrackEvent']).toHaveBeenCalledWith(
        oidcSessionServiceMock,
        trackingContextMock,
        oidcSessionMock.idpRepresentativeScope,
        trackingServiceMock.TrackedEventsMap.FC_VALID_REP_SCOPE,
      );
      expect(service['setTrackEvent']).toHaveBeenCalledTimes(1);
    });

    it('should handle cases where spRepresentativeScope is empty and track valid scope event', async () => {
      // Given
      serviceProviderServiceMock.getById.mockResolvedValue({
        rep_scope: [],
      });

      // When
      await service.handle({
        sessionOidc: oidcSessionServiceMock,
        trackingContext: trackingContextMock,
      });

      // Then
      expect(service['setTrackEvent']).toHaveBeenCalledWith(
        oidcSessionServiceMock,
        trackingContextMock,
        oidcSessionMock.idpRepresentativeScope,
        trackingServiceMock.TrackedEventsMap.FC_VALID_REP_SCOPE,
      );
    });
  });

  describe('setTrackEvent()', () => {
    it('should track the event and call super.handle with updated trackingContext', async () => {
      // Given
      const idpRepresentativeScope = ['scope1', 'scope2'];
      const trackEvent =
        trackingServiceMock.TrackedEventsMap.FC_VALID_REP_SCOPE;

      const superHandleMock = jest.spyOn(
        CoreFcpDefaultVerifyHandler.prototype,
        'handle',
      );

      serviceProviderServiceMock.getById.mockResolvedValue({
        entityId: 'entityId',
      });
      service['checkAccountBlocked'] = jest.fn();
      service['getSub'] = jest.fn();
      service['buildSpIdentity'] = jest.fn();

      // When
      await service['setTrackEvent'](
        oidcSessionServiceMock,
        trackingContextMock,
        idpRepresentativeScope,
        trackEvent,
      );

      // Then
      expect(trackingServiceMock.track).toHaveBeenCalledWith(trackEvent, {
        ...trackingContextMock,
        rep_scope: idpRepresentativeScope,
      });
      expect(superHandleMock).toHaveBeenCalledWith({
        sessionOidc: oidcSessionServiceMock,
        trackingContext: {
          ...trackingContextMock,
          rep_scope: idpRepresentativeScope,
        },
      });
    });
  });

  describe('hasAtLeastOneMatchingRepresentativeScope()', () => {
    it('should return true when there is at least one matching scope', () => {
      const spRepScopes = ['scope1', 'scope2'];
      const idpRepScope = ['scope4', 'scope2', 'scope5'];

      const result = service['hasAtLeastOneMatchingRepresentativeScope'](
        spRepScopes,
        idpRepScope,
      );

      expect(result).toBe(true);
    });

    it('should return false when there are no matching scopes', () => {
      const spRepScopes = ['scope1', 'scope2'];
      const idpRepScope = ['scope3', 'scope4'];

      const result = service['hasAtLeastOneMatchingRepresentativeScope'](
        spRepScopes,
        idpRepScope,
      );

      expect(result).toBe(false);
    });

    it('should return false when spRepScopes is empty', () => {
      const spRepScopes = [];
      const idpRepScope = ['scope1', 'scope2'];

      const result = service['hasAtLeastOneMatchingRepresentativeScope'](
        spRepScopes,
        idpRepScope,
      );

      expect(result).toBe(false);
    });

    it('should return false when idpRepScope is empty', () => {
      const spRepScopes = ['scope1', 'scope2'];
      const idpRepScope = [];

      const result = service['hasAtLeastOneMatchingRepresentativeScope'](
        spRepScopes,
        idpRepScope,
      );

      expect(result).toBe(false);
    });

    it('should return false when both spRepScopes and idpRepScope are empty', () => {
      const spRepScopes = [];
      const idpRepScope = [];

      const result = service['hasAtLeastOneMatchingRepresentativeScope'](
        spRepScopes,
        idpRepScope,
      );

      expect(result).toBe(false);
    });
  });
});
