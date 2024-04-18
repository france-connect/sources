import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CoreAccountService, CoreAcrService } from '@fc/core';
import { CryptographyEidasService } from '@fc/cryptography-eidas';
import { I18nService } from '@fc/i18n';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { TrackingService } from '@fc/tracking';

import { getI18nServiceMock } from '@mocks/i18n';
import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { CoreFcpEidasVerifyHandler } from './core-fcp-eidas-verify.handler';

describe('CoreFcpEidasVerifyHandler', () => {
  let service: CoreFcpEidasVerifyHandler;

  const loggerServiceMock = getLoggerMock();
  const i18nMock = getI18nServiceMock();

  const uidMock = '42';

  const getInteractionResultMock = {
    prompt: {},

    params: {
      // oidc param
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'eidas3',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: 'spId',
    },
    uid: uidMock,
  };
  const getInteractionMock = jest.fn();

  const sessionServiceMock = getSessionServiceMock();

  const spIdentityMock = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'Edward',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    family_name: 'TEACH',
    email: 'eteach@fqdn.ext',
  };

  const idpIdentityMock = {
    sub: 'sub',
    email: 'some@email.com',
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const trackingMock = {
    track: jest.fn(),
  };

  const accountIdMock = 'accountIdMock value';

  const coreAccountServiceMock = {
    computeFederation: jest.fn(),
  };

  const coreAcrServiceMock = {
    checkIfAcrIsValid: jest.fn(),
  };

  const serviceProviderMock = {
    getById: jest.fn(),
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

  const cryptographyEidasServiceMock = {
    computeSubV1: jest.fn(),
    computeIdentityHash: jest.fn(),
  };

  const identityProviderAdapterMock = {
    getById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        CoreAccountService,
        CoreAcrService,
        CoreFcpEidasVerifyHandler,
        LoggerService,
        I18nService,
        TrackingService,
        ServiceProviderAdapterMongoService,
        IdentityProviderAdapterMongoService,
        CryptographyEidasService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(CoreAccountService)
      .useValue(coreAccountServiceMock)
      .overrideProvider(CoreAcrService)
      .useValue(coreAcrServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(I18nService)
      .useValue(i18nMock)
      .overrideProvider(TrackingService)
      .useValue(trackingMock)
      .overrideProvider(ServiceProviderAdapterMongoService)
      .useValue(serviceProviderMock)
      .overrideProvider(CryptographyEidasService)
      .useValue(cryptographyEidasServiceMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderAdapterMock)
      .compile();

    service = module.get<CoreFcpEidasVerifyHandler>(CoreFcpEidasVerifyHandler);

    jest.resetAllMocks();

    getInteractionMock.mockResolvedValue(getInteractionResultMock);
    sessionServiceMock.get.mockReturnValue(sessionDataMock);
    cryptographyEidasServiceMock.computeIdentityHash.mockReturnValueOnce(
      'spIdentityHash',
    );
    cryptographyEidasServiceMock.computeSubV1.mockReturnValueOnce(
      'computedSubSp',
    );

    coreAccountServiceMock.computeFederation.mockResolvedValue(accountIdMock);

    identityProviderAdapterMock.getById.mockResolvedValue({
      maxAuthorizedAcr: 'maxAuthorizedAcr value',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    const spMock = {
      key: '123456',
      entityId: 'AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHH',
    };

    const trackingContext = {};

    const handleArgument = {
      sessionOidc: sessionServiceMock,
      trackingContext,
    };

    beforeEach(() => {
      serviceProviderMock.getById.mockResolvedValue(spMock);
    });

    it('Should not throw if verified', async () => {
      // Then
      await expect(service.handle(handleArgument)).resolves.not.toThrow();
    });

    // Dependencies sevices errors
    it('Should throw if acr is not validated', async () => {
      // Given
      const errorMock = new Error('my error 1');
      coreAcrServiceMock.checkIfAcrIsValid.mockImplementation(() => {
        throw errorMock;
      });
      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
    });

    it('Should throw if identity provider is not usable', async () => {
      // Given
      const errorMock = new Error('my error');
      sessionServiceMock.get.mockImplementationOnce(() => {
        throw errorMock;
      });
      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
    });

    it('Should throw if identity storage for service provider fails', async () => {
      // Given
      const errorMock = new Error('my error');
      sessionServiceMock.set.mockImplementationOnce(() => {
        throw errorMock;
      });
      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
    });

    it('Should call computeFederation()', async () => {
      // When
      await service.handle(handleArgument);
      // Then
      expect(coreAccountServiceMock.computeFederation).toHaveBeenCalledTimes(1);
      expect(coreAccountServiceMock.computeFederation).toBeCalledWith({
        key: spMock.entityId,
        sub: 'computedSubSp',
        identityHash: 'spIdentityHash',
      });
    });

    /**
     * @TODO #134 Test when implemented
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/134
     *
     * // RNIPP resilience
     * it('Should pass if rnipp is down and account is known', async () => {});
     * it('Should throw if rnipp is down and account is unknown', async () => {});
     *
     * // Service provider usability
     * it('Should throw if service provider is not usable ', async () => {});
     */

    it('should call computeIdentityHash with service provider identity on first call', async () => {
      // When
      await service.handle(handleArgument);

      // Then
      expect(
        cryptographyEidasServiceMock.computeIdentityHash,
      ).toHaveBeenCalledTimes(1);
      expect(
        cryptographyEidasServiceMock.computeIdentityHash,
      ).toHaveBeenCalledWith(idpIdentityMock);
    });

    it('should call computeSubV1 with entityId and spIdentityHash', async () => {
      // When
      await service.handle(handleArgument);

      // Then
      expect(cryptographyEidasServiceMock.computeSubV1).toHaveBeenCalledTimes(
        1,
      );
      expect(cryptographyEidasServiceMock.computeSubV1).toHaveBeenCalledWith(
        spMock.entityId,
        'spIdentityHash',
      );
    });

    it('should set language to en-GB in session', async () => {
      // When
      await service.handle(handleArgument);

      // Then
      expect(i18nMock.setSessionLanguage).toHaveBeenCalledExactlyOnceWith(
        'en-GB',
      );
    });

    it('Should save to session ', async () => {
      // Given
      const technicalClaims = { tech: 'claims' };

      service['getTechnicalClaims'] = jest
        .fn()
        .mockReturnValueOnce(technicalClaims);
      // When
      await service.handle(handleArgument);
      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledExactlyOnceWith({
        idpIdentity: { sub: idpIdentityMock.sub },
        spIdentity: {
          email: idpIdentityMock.email,
          ...technicalClaims,
        },
        accountId: accountIdMock,
        subs: {
          // FranceConnect claims naming convention
          // eslint-disable-next-line @typescript-eslint/naming-convention
          sp_id: 'computedSubSp',
        },
      });
    });
  });

  describe('getTechnicalClaims', () => {
    it('should return technical claims', () => {
      // Given
      const idpId = Symbol('idpId') as unknown as string;
      // When
      const result = service['getTechnicalClaims'](idpId);
      // Then
      expect(result).toEqual({
        // OIDC fashion naming
        // eslint-disable-next-line @typescript-eslint/naming-convention
        idp_id: idpId,
      });
    });
  });
});
