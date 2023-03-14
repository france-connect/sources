import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { PartialExcept } from '@fc/common';
import { ConfigService } from '@fc/config';
import { FeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger-legacy';
import { IdentityProviderMetadata, IOidcIdentity, OidcSession } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
import { ScopesService } from '@fc/scopes';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { SessionService } from '@fc/session';

import { ProcessCore } from '../enums';
import { IVerifyFeatureHandler } from '../interfaces';
import { CoreFcpService } from './core-fcp.service';

describe('CoreFcpService', () => {
  let service: CoreFcpService;

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    trace: jest.fn(),
  };

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

  const reqMock = {};

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

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreFcpService,
        LoggerService,
        ConfigService,
        OidcAcrService,
        IdentityProviderAdapterMongoService,
        SessionService,
        ScopesService,
        ServiceProviderAdapterMongoService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
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

  describe('verify()', () => {
    it('should return a promise', async () => {
      // action
      const result = service.verify(sessionServiceMock, reqMock);
      await result;
      // expect
      expect(result).toBeInstanceOf(Promise);
    });

    it('Should call session.get() with `interactionId`', async () => {
      // Given
      // When
      await service.verify(sessionServiceMock, reqMock);
      // Then
      expect(sessionServiceMock.get).toBeCalledTimes(1);
      expect(sessionServiceMock.get).toBeCalledWith();
    });

    it('Should call `getFeature` to get instantiated featureHandler class', async () => {
      // Given
      const getFeatureMock = jest.spyOn<CoreFcpService, any>(
        service,
        'getFeature',
      );
      // When
      await service.verify(sessionServiceMock, reqMock);
      // Then
      expect(getFeatureMock).toBeCalledTimes(1);
      expect(getFeatureMock).toBeCalledWith(
        sessionDataMock.idpId,
        ProcessCore.CORE_VERIFY,
      );
    });

    it('Should call featureHandle.handle() with `sessionService`', async () => {
      // Given
      const handlerArgument = {
        sessionOidc: sessionServiceMock,
        trackingContext: reqMock,
      };
      // When
      await service.verify(sessionServiceMock, reqMock);
      // Then
      expect(featureHandlerServiceMock.handle).toBeCalledTimes(1);
      expect(featureHandlerServiceMock.handle).toBeCalledWith(handlerArgument);
    });
  });

  describe('getFeature()', () => {
    it('should return class for specific process', async () => {
      // When
      const result = await service.getFeature<IVerifyFeatureHandler>(
        sessionDataMock.idpId,
        ProcessCore.ID_CHECK,
      );
      // Then
      expect(result).toStrictEqual(featureHandlerServiceMock);
    });

    it('should have called log when feature is required', async () => {
      // When
      const result = await service.getFeature<IVerifyFeatureHandler>(
        sessionDataMock.idpId,
        ProcessCore.ID_CHECK,
      );
      // Then
      expect(result).toBeDefined();
      expect(loggerServiceMock.debug).toHaveBeenCalledTimes(1);
      expect(loggerServiceMock.debug).toHaveBeenCalledWith(
        `getFeature idpIdentityCheck for provider: 42`,
      );
    });

    it('should have search idp when feature is required', async () => {
      // When
      const result = await service.getFeature<IVerifyFeatureHandler>(
        sessionDataMock.idpId,
        ProcessCore.ID_CHECK,
      );
      // Then
      expect(result).toBeDefined();
      expect(IdentityProviderMock.getById).toHaveBeenCalledTimes(1);
      expect(IdentityProviderMock.getById).toHaveBeenCalledWith(
        sessionDataMock.idpId,
      );
    });

    it('should have extract class from class id when feature is required', async () => {
      // When
      const result = await service.getFeature<IVerifyFeatureHandler>(
        sessionDataMock.idpId,
        ProcessCore.ID_CHECK,
      );
      // Then
      expect(result).toBeDefined();
      expect(featureHandlerGetSpy).toHaveBeenCalledTimes(1);
      expect(featureHandlerGetSpy).toHaveBeenCalledWith(
        identityProviderResultMock.featureHandlers.idpIdentityCheck,
        service,
      );
    });

    it('should failed if process is unknown from idp feature list', async () => {
      // Given
      const errorMock = new Error('Undefined Feature');
      featureHandlerGetSpy.mockReset().mockImplementationOnce(() => {
        throw errorMock;
      });
      // When
      await expect(
        () =>
          service.getFeature<IVerifyFeatureHandler>(
            sessionDataMock.idpId,
            'Tzeentch' as unknown as ProcessCore,
          ),
        // Then
      ).rejects.toThrow(errorMock);
    });
  });

  describe('sendAuthenticationMail()', () => {
    it('should return a promise', async () => {
      // action
      const result = service.sendAuthenticationMail(sessionDataMock);
      await result;
      // expect
      expect(result).toBeInstanceOf(Promise);
    });

    it('Should call `FeatureHandler.get()` to get instantiated featureHandler class', async () => {
      // Given
      // When
      await service.sendAuthenticationMail(sessionDataMock);
      // Then
      expect(featureHandlerGetSpy).toBeCalledTimes(1);
      expect(featureHandlerGetSpy).toBeCalledWith(
        authenticationEmailMock,
        service,
      );
    });

    it('Should call featureHandle.handle() with `session`', async () => {
      // Given
      // When
      await service.sendAuthenticationMail(sessionDataMock);
      // Then
      expect(featureHandlerServiceMock.handle).toBeCalledTimes(1);
      expect(featureHandlerServiceMock.handle).toBeCalledWith(sessionDataMock);
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
  });
});
