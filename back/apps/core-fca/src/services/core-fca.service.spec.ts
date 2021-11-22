import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { CoreService } from '@fc/core';
import { FeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { SessionService } from '@fc/session';

import { CoreFcaService } from './core-fca.service';

describe('CoreFcaService', () => {
  let service: CoreFcaService;

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  };

  const coreServiceMock = {
    checkIfAccountIsBlocked: jest.fn(),
    checkIfAcrIsValid: jest.fn(),
    storeInteraction: jest.fn(),
  };

  const sessionServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const spIdentityMock = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'Edward',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    family_name: 'TEACH',
    email: 'eteach@fqdn.ext',
  };

  const idpIdentityMock = {
    sub: 'some idpSub',
  };

  const sessionDataMock = {
    idpId: '42',
    idpAcr: 'eidas3',
    idpName: 'my favorite Idp',
    idpIdentity: idpIdentityMock,

    spId: 'sp_id',
    spAcr: 'eidas3',
    spName: 'my great SP',
    spIdentity: spIdentityMock,
  };

  const featureHandlerMock = jest.spyOn(FeatureHandler, 'get');

  const featureHandlerServiceMock = {
    handle: jest.fn(),
  };

  const moduleRefMock = {
    get: jest.fn(),
  };

  const IdentityProviderMock = {
    getById: jest.fn(),
  };

  const IdentityProviderResultMock = {
    featureHandlers: { codeVerify: 'test', authenticationEmail: null },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreFcaService,
        LoggerService,
        CoreService,
        IdentityProviderAdapterMongoService,
        SessionService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(CoreService)
      .useValue(coreServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(IdentityProviderMock)
      .overrideProvider(ModuleRef)
      .useValue(moduleRefMock)
      .compile();
    service = module.get<CoreFcaService>(CoreFcaService);

    jest.resetAllMocks();

    sessionServiceMock.get.mockResolvedValue(sessionDataMock);
    coreServiceMock.storeInteraction.mockResolvedValue({ spInteraction: {} });
    featureHandlerMock.mockReturnValueOnce(featureHandlerServiceMock);
    IdentityProviderMock.getById.mockResolvedValue(IdentityProviderResultMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verify()', () => {
    it('Should call session.get() with `interactionId`', async () => {
      // Given
      // When
      await service.verify(sessionServiceMock);
      // Then
      expect(sessionServiceMock.get).toBeCalledTimes(1);
      expect(sessionServiceMock.get).toBeCalledWith();
    });

    it('Should call `FeatureHandler.get()` to get instantiated featureHandler class', async () => {
      // Given
      // When
      await service.verify(sessionServiceMock);
      // Then
      expect(featureHandlerMock).toBeCalledTimes(1);
    });

    it('Should call featureHandle.handle() with `sessionService`', async () => {
      // Given
      // When
      await service.verify(sessionServiceMock);
      // Then
      expect(featureHandlerServiceMock.handle).toBeCalledTimes(1);
      expect(featureHandlerServiceMock.handle).toBeCalledWith(
        sessionServiceMock,
      );
    });
  });
});
