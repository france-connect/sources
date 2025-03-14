import { Response } from 'express';

import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { PartialExcept } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CORE_AUTH_SERVICE, CoreAuthorizationService } from '@fc/core';
import { DeviceInformationInterface } from '@fc/device';
import { FeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { IdentityProviderMetadata, IOidcIdentity, OidcSession } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
import { OidcClientService } from '@fc/oidc-client';
import { InteractionInterface } from '@fc/oidc-provider';
import { ScopesService } from '@fc/scopes';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { SessionService } from '@fc/session';

import { getConfigMock } from '@mocks/config';
import { getCoreAuthorizationServiceMock } from '@mocks/core';
import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { CoreFcpService } from './core-fcp.service';

describe('CoreFcpService', () => {
  let service: CoreFcpService;

  const configServiceMock = getConfigMock();

  const oidcAcrServiceMock = {
    isAcrValid: jest.fn(),
    getAcrToAskToIdp: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();

  const spIdentityMock = {
    given_name: 'Edward',
    family_name: 'TEACH',
    email: 'eteach@fqdn.ext',
  } as IOidcIdentity;

  const idpIdentityMock = {
    sub: 'some idpSub',
  } as PartialExcept<IOidcIdentity, 'sub'>;

  const sessionDataMock: OidcSession = {
    idpId: '42',
    idpAcr: 'eidas3',
    idpName: 'my favorite Idp',
    idpIdentity: idpIdentityMock,

    spId: 'sp_id',
    spAcr: 'eidas3',
    spName: 'my great SP',
    spIdentity: spIdentityMock,
  };

  let featureHandlerGetSpy;

  const featureHandlerServiceMock = {
    handle: jest.fn(),
  };

  const moduleRefMock = {
    get: jest.fn(),
  };

  const IdentityProviderMock = {
    getById: jest.fn(),
  };

  const scopesServiceMock = {
    getRichClaimsFromScopes: jest.fn(),
    getRawClaimsFromScopes: jest.fn(),
  };

  const serviceProviderMock = {
    getById: jest.fn(),
    consentRequired: jest.fn(),
  };

  const coreVerifyMock = 'core-fcp-default-verify';
  const authenticationEmailMock = 'core-fcp-send-email';

  const idpIdentityCheckMock = 'core-fcp-eidas-identity-check';

  const identityProviderResultMock = {
    featureHandlers: {
      coreVerify: coreVerifyMock,
      authenticationEmail: authenticationEmailMock,
      idpIdentityCheck: idpIdentityCheckMock,
    },
  } as unknown as IdentityProviderMetadata;

  const coreAuthorizationServiceMock = getCoreAuthorizationServiceMock();

  const oidcClientServiceMock = {
    utils: {
      checkIdpBlacklisted: jest.fn(),
      checkIdpDisabled: jest.fn(),
      buildAuthorizeParameters: jest.fn(),
      getAuthorizeUrl: jest.fn(),
    },
  };

  const loggerServiceMock = getLoggerMock();

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreFcpService,
        {
          provide: CORE_AUTH_SERVICE,
          useClass: CoreAuthorizationService,
        },
        ConfigService,
        OidcAcrService,
        IdentityProviderAdapterMongoService,
        SessionService,
        ScopesService,
        ServiceProviderAdapterMongoService,
        OidcClientService,
        CoreAuthorizationService,
        LoggerService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(OidcAcrService)
      .useValue(oidcAcrServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(IdentityProviderMock)
      .overrideProvider(ModuleRef)
      .useValue(moduleRefMock)
      .overrideProvider(ScopesService)
      .useValue(scopesServiceMock)
      .overrideProvider(ServiceProviderAdapterMongoService)
      .useValue(serviceProviderMock)
      .overrideProvider(OidcClientService)
      .useValue(oidcClientServiceMock)
      .overrideProvider(CORE_AUTH_SERVICE)
      .useValue(coreAuthorizationServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<CoreFcpService>(CoreFcpService);

    featureHandlerGetSpy = jest.spyOn(FeatureHandler, 'get');

    sessionServiceMock.get.mockResolvedValue(sessionDataMock);
    featureHandlerGetSpy.mockReturnValueOnce(featureHandlerServiceMock);
    IdentityProviderMock.getById.mockResolvedValue(identityProviderResultMock);
    serviceProviderMock.getById.mockResolvedValue(serviceProviderMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendNotificationMail()', () => {
    const deviceInfo = {
      isTrusted: true,
      isSuspicious: false,
    } as DeviceInformationInterface;

    beforeEach(() => {
      service['shouldSendNotificationMail'] = jest.fn().mockReturnValue(true);
    });

    it('should return a promise', async () => {
      // given
      sessionServiceMock.get.mockReset().mockReturnValue({
        sentNotificationsForSp: [],
      });

      // action
      const result = service.sendNotificationMail(deviceInfo);
      await result;
      // expect
      expect(result).toBeInstanceOf(Promise);
    });

    it('should call `FeatureHandler.get()` to get instantiated featureHandler class', async () => {
      // Given
      sessionServiceMock.get.mockReset().mockReturnValue({
        sentNotificationsForSp: [],
      });

      // When
      await service.sendNotificationMail(deviceInfo);
      // Then
      expect(featureHandlerGetSpy).toBeCalledTimes(1);
      expect(featureHandlerGetSpy).toBeCalledWith(
        authenticationEmailMock,
        service,
      );
    });

    it('should use an empty array if session `Core.sentNotificationsForSp` is not set', async () => {
      // Given
      const spIdMock = Symbol('spIdMockValue');
      sessionServiceMock.get.mockReset().mockReturnValue({ spId: spIdMock });

      // When
      await service.sendNotificationMail(deviceInfo);

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledExactlyOnceWith(
        'Core',
        'sentNotificationsForSp',
        [spIdMock],
      );
    });

    it('should use an empty array if session `Core` is not set', async () => {
      // Given
      const spIdMock = Symbol('spIdMockValue');
      sessionServiceMock.get
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce({ spId: spIdMock });

      // When
      await service.sendNotificationMail(deviceInfo);

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledExactlyOnceWith(
        'Core',
        'sentNotificationsForSp',
        [spIdMock],
      );
    });

    it('should call featureHandle.handle()', async () => {
      // Given
      sessionServiceMock.get.mockReset().mockReturnValue({
        sentNotificationsForSp: [],
      });

      // When
      await service.sendNotificationMail(deviceInfo);

      // Then
      expect(
        featureHandlerServiceMock.handle,
      ).toHaveBeenCalledExactlyOnceWith();
    });

    it('should call featureHandle.handle() when notification from another service provider is already sent', async () => {
      // Given
      const anotherSpIdMock = 'another_sp_id';
      sessionServiceMock.get.mockReset().mockReturnValue({
        sentNotificationsForSp: [anotherSpIdMock],
      });

      // When
      await service.sendNotificationMail(deviceInfo);

      // Then
      expect(featureHandlerServiceMock.handle).toHaveBeenCalledOnce();
    });

    it('should not call featureHandler.handle() if authenticationMail is not to be sent', async () => {
      // Given
      service['shouldSendNotificationMail'] = jest
        .fn()
        .mockReturnValueOnce(false);

      // When
      await service.sendNotificationMail(deviceInfo);

      // Then
      expect(featureHandlerServiceMock.handle).not.toHaveBeenCalled();
    });
  });

  describe('shouldSendNotificationMail()', () => {
    // Given

    const spIdMock = 'spIdMockValue';
    const deviceInfoMock = { isTrusted: false } as DeviceInformationInterface;
    const sentNotificationsForSpMock = ['foo'];

    beforeEach(() => {
      service['isForcedByDevice'] = jest.fn().mockReturnValue(false);
      service['isAlreadySent'] = jest.fn().mockReturnValue(false);
    });

    it('should return false if alreadySent', () => {
      // Given
      service['isAlreadySent'] = jest.fn().mockReturnValueOnce(true);

      // When
      const result = service['shouldSendNotificationMail'](
        spIdMock,
        deviceInfoMock,
        sentNotificationsForSpMock,
      );

      // Then
      expect(result).toBeFalse();
    });

    it('should return true if NOT alreadySent and forcedByDevice', () => {
      // Given
      service['isForcedByDevice'] = jest.fn().mockReturnValueOnce(true);

      // When
      const result = service['shouldSendNotificationMail'](
        spIdMock,
        deviceInfoMock,
        sentNotificationsForSpMock,
      );

      // Then
      expect(result).toBeTrue();
    });

    it('should return false if trusted, NOT alreadySent and NOT forcedByDevice', () => {
      // When
      const result = service['shouldSendNotificationMail'](
        spIdMock,
        { isTrusted: true } as DeviceInformationInterface,
        sentNotificationsForSpMock,
      );

      // Then
      expect(result).toBeFalse();
    });

    it('should return true if NOT trusted, NOT alreadySent and NOT forcedByDevice', () => {
      // Given
      const deviceInfoMock = {
        isTrusted: false,
      } as DeviceInformationInterface;

      // When
      const result = service['shouldSendNotificationMail'](
        spIdMock,
        deviceInfoMock,
        sentNotificationsForSpMock,
      );

      // Then
      expect(result).toBeTrue();
    });
  });

  describe('isForcedByDevice()', () => {
    it('should return true if suspicious', () => {
      // Given
      const deviceInfoMock = {
        isSuspicious: true,
      } as DeviceInformationInterface;

      // When
      const result = service['isForcedByDevice'](deviceInfoMock);

      // Then
      expect(result).toBeTrue();
    });

    it('should return true if newIdentity', () => {
      // Given
      const deviceInfoMock = {
        newIdentity: true,
      } as DeviceInformationInterface;

      // When
      const result = service['isForcedByDevice'](deviceInfoMock);

      // Then
      expect(result).toBeTrue();
    });

    it('should return false if trusted, not suspicious and not newIdentity', () => {
      // Given
      const deviceInfoMock = {
        isTrusted: true,
        isSuspicious: false,
        newIdentity: false,
      } as DeviceInformationInterface;

      // When
      const result = service['isForcedByDevice'](deviceInfoMock);

      // Then
      expect(result).toBeFalse();
    });
  });

  describe('isAlreadySent()', () => {
    it('should return true if spId is in sentNotificationsForSp', () => {
      // Given
      const spIdMock = 'foo';
      const sentNotificationsForSpMock = ['foo'];

      // When
      const result = service['isAlreadySent'](
        spIdMock,
        sentNotificationsForSpMock,
      );

      // Then
      expect(result).toBeTrue();
    });

    it('should return false if spId is not in sentNotificationsForSp', () => {
      // Given
      const spIdMock = 'foo';
      const sentNotificationsForSpMock = ['bar'];

      // When
      const result = service['isAlreadySent'](
        spIdMock,
        sentNotificationsForSpMock,
      );

      // Then
      expect(result).toBeFalse();
    });
  });

  describe('isConsentRequired', () => {
    const serviceProviderDataMock = {
      type: 'public',
      identityConsent: false,
    };
    const spIdMock = 'foo';

    beforeEach(() => {
      serviceProviderMock.getById.mockResolvedValue(serviceProviderDataMock);
    });

    it('should get service provider by id', async () => {
      // When
      await service.isConsentRequired(spIdMock);
      // Then
      expect(serviceProviderMock.getById).toHaveBeenCalledTimes(1);
      expect(serviceProviderMock.getById).toHaveBeenCalledWith(spIdMock);
    });

    it('should get consent requirement', async () => {
      // When
      await service.isConsentRequired(spIdMock);
      // Then
      expect(serviceProviderMock.consentRequired).toHaveBeenCalledTimes(1);
      expect(serviceProviderMock.consentRequired).toHaveBeenCalledWith(
        serviceProviderDataMock.type,
        serviceProviderDataMock.identityConsent,
      );
    });

    it('should return consent requirement (false)', async () => {
      // Given
      serviceProviderMock.consentRequired.mockReturnValue(false);

      // When
      const result = await service.isConsentRequired(spIdMock);
      // Then
      expect(result).toEqual(false);
    });

    it('should return consent requirement (true)', async () => {
      // Given
      serviceProviderMock.consentRequired.mockReturnValue(true);
      // When
      const result = await service.isConsentRequired(spIdMock);
      // Then
      expect(result).toEqual(true);
    });
  });

  describe('isInsufficientAcrLevel', () => {
    const minAcrForContextRequestMock = 'eidas2';

    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce({
        minAcrForContextRequest: minAcrForContextRequestMock,
      });
    });

    it('should retrieve "minAcrForContextRequest" from AppConfig', () => {
      // Given
      const isSuspicious = false;

      // When
      service.isInsufficientAcrLevel('not_checked_for_this_test', isSuspicious);

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('App');
    });

    it('should return false if context is not suspicious', () => {
      // Given
      const isSuspicious = false;

      // When
      const result = service.isInsufficientAcrLevel(
        'not_checked_for_this_test',
        isSuspicious,
      );

      // Then
      expect(result).toBeFalse();
    });

    it('should call oidcAcr.isAcrValid() with given "acrValue" and "minAcrForContextRequest" from AppConfig if context is suspicious', () => {
      // Given
      const givenAcr = 'eidas3';
      const isSuspicious = true;

      // When
      service.isInsufficientAcrLevel(givenAcr, isSuspicious);

      // Then
      expect(oidcAcrServiceMock.isAcrValid).toHaveBeenCalledTimes(1);
      expect(oidcAcrServiceMock.isAcrValid).toHaveBeenCalledWith(
        givenAcr,
        minAcrForContextRequestMock,
      );
    });

    it('should return false if context is suspicious and acr is valid', () => {
      // Given
      oidcAcrServiceMock.isAcrValid.mockReturnValueOnce(true);
      const isSuspicious = true;

      // When
      const result = service.isInsufficientAcrLevel(
        'not_checked_for_this_test',
        isSuspicious,
      );

      // Then
      expect(result).toBeFalse();
    });

    it('should return true if context is suspicious and acr is invalid', () => {
      // Given
      oidcAcrServiceMock.isAcrValid.mockReturnValueOnce(false);
      const isSuspicious = true;

      // When
      const result = service.isInsufficientAcrLevel(
        'not_checked_for_this_test',
        isSuspicious,
      );

      // Then
      expect(result).toBeTrue();
    });
  });

  describe('getClaimsLabelsForInteraction', () => {
    const interactionMock = {} as unknown as InteractionInterface;
    const scopesMock = ['openid', 'profile'];
    const getRichClaimsFromScopesReturnedValue = ['foo'];

    beforeEach(() => {
      service.getScopesForInteraction = jest.fn().mockReturnValue(scopesMock);
      scopesServiceMock.getRichClaimsFromScopes.mockReturnValue(
        getRichClaimsFromScopesReturnedValue,
      );
    });

    it('should get scopes from interaction', () => {
      // When
      service.getClaimsLabelsForInteraction(interactionMock);
      // Then
      expect(service.getScopesForInteraction).toHaveBeenCalledTimes(1);
      expect(service.getScopesForInteraction).toHaveBeenCalledWith(
        interactionMock,
      );
    });

    it('should convert scope to claim labels', () => {
      // When
      service.getClaimsLabelsForInteraction(interactionMock);
      // Then
      expect(scopesServiceMock.getRichClaimsFromScopes).toHaveBeenCalledTimes(
        1,
      );
      expect(scopesServiceMock.getRichClaimsFromScopes).toHaveBeenCalledWith(
        scopesMock,
      );
    });

    it('should return claim labels', () => {
      // When
      const result = service.getClaimsLabelsForInteraction(interactionMock);
      // Then
      expect(result).toBe(getRichClaimsFromScopesReturnedValue);
    });
  });

  describe('getClaimsForInteraction', () => {
    const interactionMock = {} as unknown as InteractionInterface;
    const scopesMock = ['openid', 'profile'];
    const getRawClaimsFromScopesReturnedValue = ['foo'];

    beforeEach(() => {
      service.getScopesForInteraction = jest.fn().mockReturnValue(scopesMock);
      scopesServiceMock.getRawClaimsFromScopes.mockReturnValue(
        getRawClaimsFromScopesReturnedValue,
      );
    });

    it('should get scopes from interaction', () => {
      // When
      service.getClaimsForInteraction(interactionMock);
      // Then
      expect(service.getScopesForInteraction).toHaveBeenCalledTimes(1);
      expect(service.getScopesForInteraction).toHaveBeenCalledWith(
        interactionMock,
      );
    });

    it('should convert scope to claims', () => {
      // When
      service.getClaimsForInteraction(interactionMock);
      // Then
      expect(scopesServiceMock.getRawClaimsFromScopes).toHaveBeenCalledTimes(1);
      expect(scopesServiceMock.getRawClaimsFromScopes).toHaveBeenCalledWith(
        scopesMock,
      );
    });

    it('should return claims', () => {
      // When
      const result = service.getClaimsForInteraction(interactionMock);
      // Then
      expect(result).toBe(getRawClaimsFromScopesReturnedValue);
    });
  });

  describe('getScopesForInteraction', () => {
    const interactionMock = {
      params: {
        scope: 'openid profile',
      },
    } as unknown as InteractionInterface;

    it('should return scopes extracted and parsed from interaction', () => {
      // When
      const result = service.getScopesForInteraction(interactionMock);
      // Then
      expect(result).toEqual(['openid', 'profile']);
    });

    it('should return scopes trim extracted and parsed from interaction', () => {
      // When
      const result = service.getScopesForInteraction(interactionMock);
      // Then
      expect(result).toEqual(['openid', 'profile']);
    });

    it('should return uniq list scopes extracted and parsed from interaction', () => {
      // Given
      const interactionMock = {
        params: {
          scope: 'openid profile profile',
        },
      } as unknown as InteractionInterface;
      // When
      const result = service.getScopesForInteraction(interactionMock);
      // Then
      expect(result).toEqual(['openid', 'profile']);
    });
  });

  describe('redirectToIdp()', () => {
    // Given
    const acrMock = 'acrMockValue';
    const idpIdMock = 'idpIdMockValue';
    const spIdMock = 'spIdMockValue';
    const nonceMock = Symbol('nonceMockValue');
    const stateMock = Symbol('stateMockValue');
    const scopeMock = Symbol('scopeMock');
    const resMock = {
      redirect: jest.fn(),
    } as unknown as Response;

    const authorizationParametersMock = { acr_values: acrMock };

    beforeEach(() => {
      sessionServiceMock.get.mockReturnValue({
        spId: spIdMock,
      });

      configServiceMock.get.mockReturnValueOnce({
        scope: scopeMock,
      });

      oidcClientServiceMock.utils.buildAuthorizeParameters.mockResolvedValue({
        nonce: nonceMock,
        state: stateMock,
      });
    });

    it('should call oidcClient.utils.checkIdpBlacklisted()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        authorizationParametersMock,
      );
      // Then
      expect(
        oidcClientServiceMock.utils.checkIdpBlacklisted,
      ).toHaveBeenCalledTimes(1);
      expect(
        oidcClientServiceMock.utils.checkIdpBlacklisted,
      ).toHaveBeenCalledWith(spIdMock, idpIdMock);
    });

    it('should call oidcClient.utils.checkIdpDisabled()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        authorizationParametersMock,
      );
      // Then
      expect(
        oidcClientServiceMock.utils.checkIdpDisabled,
      ).toHaveBeenCalledTimes(1);
      expect(oidcClientServiceMock.utils.checkIdpDisabled).toHaveBeenCalledWith(
        idpIdMock,
      );
    });

    it('should call oidcClient.utils.buildAuthorizeParameters()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        authorizationParametersMock,
      );
      // Then
      expect(
        oidcClientServiceMock.utils.buildAuthorizeParameters,
      ).toHaveBeenCalledTimes(1);
    });

    it('should call identityProvider.getById()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        authorizationParametersMock,
      );
      // Then
      expect(IdentityProviderMock.getById).toHaveBeenCalledTimes(1);
      expect(IdentityProviderMock.getById).toHaveBeenCalledWith(idpIdMock);
    });

    it('should call sessionService.set()', async () => {
      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        authorizationParametersMock,
      );
      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith('OidcClient', {
        idpId: idpIdMock,
        idpName: identityProviderResultMock.name,
        idpLabel: identityProviderResultMock.title,
        idpNonce: nonceMock,
        idpState: stateMock,
        idpIdentity: undefined,
        spIdentity: undefined,
        accountId: undefined,
      });
    });

    it('should call res.redirect()', async () => {
      // Given
      const authorizeUrlMock = Symbol('authorizeUrlMock');
      coreAuthorizationServiceMock.getAuthorizeUrl.mockResolvedValue(
        authorizeUrlMock,
      );

      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        authorizationParametersMock,
      );

      // Then
      expect(resMock.redirect).toHaveBeenCalledTimes(1);
      expect(resMock.redirect).toHaveBeenCalledWith(authorizeUrlMock);
    });
  });
});
