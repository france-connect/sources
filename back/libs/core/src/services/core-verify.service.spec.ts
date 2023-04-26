import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { PartialExcept } from '@fc/common';
import { FeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger-legacy';
import { IdentityProviderMetadata, IOidcIdentity, OidcSession } from '@fc/oidc';

import { ProcessCore } from '../enums';
import { CoreIdentityProviderNotFoundException } from '../exceptions';
import { IVerifyFeatureHandler } from '../interfaces';
import { CoreVerifyService } from './core-verify.service';

describe('CoreVerifyService', () => {
  let service: CoreVerifyService;

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    trace: jest.fn(),
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
        CoreVerifyService,
        LoggerService,
        IdentityProviderAdapterMongoService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(IdentityProviderMock)
      .overrideProvider(ModuleRef)
      .useValue(moduleRefMock)
      .compile();

    service = module.get<CoreVerifyService>(CoreVerifyService);

    featureHandlerGetSpy = jest.spyOn(FeatureHandler, 'get');

    sessionServiceMock.get.mockResolvedValue(sessionDataMock);
    featureHandlerGetSpy.mockReturnValueOnce(featureHandlerServiceMock);
    IdentityProviderMock.getById.mockResolvedValue(identityProviderResultMock);
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
      const getFeatureMock = jest.spyOn<CoreVerifyService, any>(
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

    it('should throw CoreIdentityProviderNotFoundException if idp is undefined', async () => {
      // Given
      IdentityProviderMock.getById.mockReset().mockResolvedValue(undefined);
      // When
      await expect(
        () =>
          service.getFeature<IVerifyFeatureHandler>(
            sessionDataMock.idpId,
            ProcessCore.ID_CHECK,
          ),
        // Then
      ).rejects.toThrow(CoreIdentityProviderNotFoundException);
    });
  });
});
