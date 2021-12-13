import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CoreService } from '@fc/core';
import { CryptographyEidasService } from '@fc/cryptography-eidas';
import { LoggerService } from '@fc/logger';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { SessionService } from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { CoreFcpEidasVerifyHandler } from './core-fcp-eidas-verify.handler';

describe('CoreFcpEidasVerifyHandler', () => {
  let service: CoreFcpEidasVerifyHandler;

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
  };

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

  const configServiceMock = {
    get: jest.fn(),
  };

  const trackingMock = {
    track: jest.fn(),
  };

  const accountIdMock = 'accountIdMock value';

  const coreServiceMock = {
    checkIfAccountIsBlocked: jest.fn(),
    checkIfAcrIsValid: jest.fn(),
    computeInteraction: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        CoreService,
        CoreFcpEidasVerifyHandler,
        LoggerService,
        SessionService,
        TrackingService,
        ServiceProviderAdapterMongoService,
        CryptographyEidasService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(CoreService)
      .useValue(coreServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingMock)
      .overrideProvider(ServiceProviderAdapterMongoService)
      .useValue(serviceProviderMock)
      .overrideProvider(CryptographyEidasService)
      .useValue(cryptographyEidasServiceMock)
      .compile();

    service = module.get<CoreFcpEidasVerifyHandler>(CoreFcpEidasVerifyHandler);

    jest.resetAllMocks();

    getInteractionMock.mockResolvedValue(getInteractionResultMock);
    sessionServiceMock.get.mockResolvedValue(sessionDataMock);
    cryptographyEidasServiceMock.computeIdentityHash.mockReturnValueOnce(
      'spIdentityHash',
    );
    cryptographyEidasServiceMock.computeSubV1
      .mockReturnValueOnce('computedSubSp')
      .mockReturnValueOnce('computedSubIdp');

    coreServiceMock.computeInteraction.mockResolvedValue(accountIdMock);
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
      coreServiceMock.checkIfAcrIsValid.mockImplementation(() => {
        throw errorMock;
      });
      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
    });

    it('Should throw if identity provider is not usable', async () => {
      // Given
      const errorMock = new Error('my error');
      sessionServiceMock.get.mockRejectedValueOnce(errorMock);
      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
    });

    it('Should throw if identity storage for service provider fails', async () => {
      // Given
      const errorMock = new Error('my error');
      sessionServiceMock.set.mockRejectedValueOnce(errorMock);
      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
    });

    it('Should call session set with amr parameter', async () => {
      // When
      await service.handle(handleArgument);
      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith({
        accountId: accountIdMock,
        amr: ['eidas'],
        idpIdentity: idpIdentityMock,
        spIdentity: { ...idpIdentityMock, sub: 'computedSubSp' },
      });
    });

    it('Should call computeInteraction()', async () => {
      // When
      await service.handle(handleArgument);
      // Then
      expect(coreServiceMock.computeInteraction).toHaveBeenCalledTimes(1);
      expect(coreServiceMock.computeInteraction).toBeCalledWith(
        {
          spId: sessionDataMock.spId,
          entityId: spMock.entityId,
          subSp: 'computedSubSp',
          hashSp: 'spIdentityHash',
        },
        {
          idpId: sessionDataMock.idpId,
          subIdp: 'computedSubIdp',
        },
      );
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

    it('should call computeSubV1 with entityId and rnippIdentityHash on first call', async () => {
      // When
      await service.handle(handleArgument);

      // Then
      expect(cryptographyEidasServiceMock.computeSubV1).toHaveBeenCalledTimes(
        2,
      );
      expect(cryptographyEidasServiceMock.computeSubV1).toHaveBeenNthCalledWith(
        1,
        spMock.entityId,
        'spIdentityHash',
      );
    });

    it('should call computeSubV1 with spId and idpIdentityHash on the second call', async () => {
      // When
      await service.handle(handleArgument);

      // Then
      expect(cryptographyEidasServiceMock.computeSubV1).toHaveBeenCalledTimes(
        2,
      );
      expect(cryptographyEidasServiceMock.computeSubV1).toHaveBeenNthCalledWith(
        2,
        sessionDataMock.spId,
        'spIdentityHash',
      );
    });
  });
});
