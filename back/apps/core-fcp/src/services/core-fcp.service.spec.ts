import { Response } from 'express';

import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { PartialExcept } from '@fc/common';
import { ConfigService } from '@fc/config';
import { FeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { IdentityProviderMetadata, IOidcIdentity, OidcSession } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
import { OidcClientService, OidcClientSession } from '@fc/oidc-client';
import { ScopesService } from '@fc/scopes';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { ISessionService, SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { CoreFcpService } from './core-fcp.service';

describe('CoreFcpService', () => {
  let service: CoreFcpService;

  const configServiceMock = {
    get: jest.fn(),
  };

  const oidcAcrServiceMock = {
    isAcrValid: jest.fn(),
  };

  const sessionServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const sessionCoreServiceMock = getSessionServiceMock();

  const spIdentityMock = {
    // oidc parameter
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'Edward',
    // eslint-disable-next-line @typescript-eslint/naming-convention
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

  const oidcClientServiceMock = {
    utils: {
      checkIdpBlacklisted: jest.fn(),
      checkIdpDisabled: jest.fn(),
      buildAuthorizeParameters: jest.fn(),
      getAuthorizeUrl: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreFcpService,
        ConfigService,
        OidcAcrService,
        IdentityProviderAdapterMongoService,
        SessionService,
        ScopesService,
        ServiceProviderAdapterMongoService,
        OidcClientService,
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

  describe('sendAuthenticationMail()', () => {
    it('should return a promise', async () => {
      // given
      sessionCoreServiceMock.get.mockReset().mockResolvedValue({
        sentNotificationsForSp: [],
      });

      // action
      const result = service.sendAuthenticationMail(
        sessionDataMock,
        sessionCoreServiceMock,
      );
      await result;
      // expect
      expect(result).toBeInstanceOf(Promise);
    });

    it('Should call `FeatureHandler.get()` to get instantiated featureHandler class', async () => {
      // Given
      sessionCoreServiceMock.get.mockReset().mockResolvedValue({
        sentNotificationsForSp: [],
      });

      // When
      await service.sendAuthenticationMail(
        sessionDataMock,
        sessionCoreServiceMock,
      );
      // Then
      expect(featureHandlerGetSpy).toBeCalledTimes(1);
      expect(featureHandlerGetSpy).toBeCalledWith(
        authenticationEmailMock,
        service,
      );
    });

    it('Should call featureHandle.handle() with `session`', async () => {
      // Given
      sessionCoreServiceMock.get.mockReset().mockResolvedValue({
        sentNotificationsForSp: [],
      });

      // When
      await service.sendAuthenticationMail(
        sessionDataMock,
        sessionCoreServiceMock,
      );

      // Then
      expect(featureHandlerServiceMock.handle).toBeCalledTimes(1);
      expect(featureHandlerServiceMock.handle).toBeCalledWith(sessionDataMock);
    });

    it('Should not call featureHandle.handle() when notification is already sent', async () => {
      // Given
      const spIdMock = 'sp_id';
      sessionCoreServiceMock.get.mockReset().mockResolvedValue({
        sentNotificationsForSp: [spIdMock],
      });

      // When
      await service.sendAuthenticationMail(
        sessionDataMock,
        sessionCoreServiceMock,
      );

      // Then
      expect(featureHandlerServiceMock.handle).not.toBeCalled();
    });

    it('Should call featureHandle.handle() when notification from another service provider is already sent', async () => {
      // Given
      const anotherSpIdMock = 'another_sp_id';
      sessionCoreServiceMock.get.mockReset().mockResolvedValue({
        sentNotificationsForSp: [anotherSpIdMock],
      });

      // When
      await service.sendAuthenticationMail(
        sessionDataMock,
        sessionCoreServiceMock,
      );

      // Then
      expect(featureHandlerServiceMock.handle).toBeCalled();
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
    const interactionMock = {};
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
    const interactionMock = {};
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
    it('should return scopes extracted and parsed from interaction', () => {
      // Given
      const interactionMock = {
        params: {
          scope: 'openid profile',
        },
      };
      // When
      const result = service.getScopesForInteraction(interactionMock);
      // Then
      expect(result).toEqual(['openid', 'profile']);
    });

    it('should return scopes trim extracted and parsed from interaction', () => {
      // Given
      const interactionMock = {
        params: {
          scope: ' openid profile ',
        },
      };
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
      };
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

    beforeEach(() => {
      sessionServiceMock.get.mockResolvedValue({
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
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
        { acr: acrMock },
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
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
        { acr: acrMock },
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
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
        { acr: acrMock },
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
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
        { acr: acrMock },
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
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
        { acr: acrMock },
      );
      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith({
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
      oidcClientServiceMock.utils.getAuthorizeUrl.mockResolvedValue(
        authorizeUrlMock,
      );

      // When
      await service.redirectToIdp(
        resMock,
        idpIdMock,
        sessionServiceMock as unknown as ISessionService<OidcClientSession>,
        { acr: acrMock },
      );

      // Then
      expect(resMock.redirect).toHaveBeenCalledTimes(1);
      expect(resMock.redirect).toHaveBeenCalledWith(authorizeUrlMock);
    });
  });
});
