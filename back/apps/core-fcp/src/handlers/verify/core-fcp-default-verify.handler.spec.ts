import { Test, TestingModule } from '@nestjs/testing';

import { AccountBlockedException } from '@fc/account';
import { RequiredExcept } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CoreService } from '@fc/core';
import { CryptographyFcpService } from '@fc/cryptography-fcp';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity } from '@fc/oidc';
import {
  RnippReceivedValidEvent,
  RnippRequestedEvent,
  RnippService,
} from '@fc/rnipp';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { SessionService } from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { CoreFcpDefaultVerifyHandler } from './core-fcp-default-verify.handler';

describe('CoreFcpDefaultVerifyHandler', () => {
  let service: CoreFcpDefaultVerifyHandler;

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    trace: jest.fn(),
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

  const rnippServiceMock = {
    check: jest.fn(),
  };

  const spIdentityMock = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'Edward',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    family_name: 'TEACH',
    email: 'eteach@fqdn.ext',
  } as RequiredExcept<IOidcIdentity, 'sub' | 'email'>;

  const idpIdentityMock = {
    sub: 'some idpSub',
  };

  const reqMock = {
    fc: { interactionId: uidMock },
    ip: '123.123.123.123',
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const trackingMock = {
    track: jest.fn(),
  };

  const coreServiceMock = {
    checkIfAccountIsBlocked: jest.fn(),
    checkIfAcrIsValid: jest.fn(),
    computeInteraction: jest.fn(),
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

  const serviceProviderMock = {
    getById: jest.fn(),
  };

  const cryptographyFcpServiceMock = {
    computeSubV1: jest.fn(),
    computeIdentityHash: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        CoreService,
        CoreFcpDefaultVerifyHandler,
        LoggerService,
        SessionService,
        RnippService,
        TrackingService,
        ServiceProviderAdapterMongoService,
        CryptographyFcpService,
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
      .overrideProvider(RnippService)
      .useValue(rnippServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingMock)
      .overrideProvider(ServiceProviderAdapterMongoService)
      .useValue(serviceProviderMock)
      .overrideProvider(CryptographyFcpService)
      .useValue(cryptographyFcpServiceMock)
      .compile();

    service = module.get<CoreFcpDefaultVerifyHandler>(
      CoreFcpDefaultVerifyHandler,
    );

    jest.resetAllMocks();

    getInteractionMock.mockResolvedValue(getInteractionResultMock);
    sessionServiceMock.get.mockResolvedValue(sessionDataMock);
    rnippServiceMock.check.mockResolvedValue(spIdentityMock);
    cryptographyFcpServiceMock.computeIdentityHash
      .mockReturnValueOnce('spIdentityHash')
      .mockReturnValueOnce('idpIdentityHash');
    cryptographyFcpServiceMock.computeSubV1
      .mockReturnValueOnce('computedSubSp')
      .mockReturnValueOnce('computedSubIdp');
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

    it('Should throw if account is blocked', async () => {
      // Given
      const errorMock = new AccountBlockedException();
      coreServiceMock.checkIfAccountIsBlocked.mockRejectedValueOnce(errorMock);

      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
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

    it('Should throw if service Provider service fails', async () => {
      // Given
      const errorMock = new Error('my error');
      serviceProviderMock.getById.mockReset().mockRejectedValueOnce(errorMock);

      // When
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
    });

    it('Should throw if rnipp check refuses identity', async () => {
      // Given
      const errorMock = new Error('my error');
      rnippServiceMock.check.mockRejectedValueOnce(errorMock);
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
        amr: ['fc'],
        idpIdentity: { sub: 'computedSubIdp' },
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

    it('should call computeIdentityHash with rnipp identity on first call', async () => {
      // When
      await service.handle(handleArgument);

      // Then
      expect(
        cryptographyFcpServiceMock.computeIdentityHash,
      ).toHaveBeenCalledTimes(2);
      expect(
        cryptographyFcpServiceMock.computeIdentityHash,
      ).toHaveBeenNthCalledWith(1, spIdentityMock);
    });

    it('should call computeIdentityHash with identity given by the identity provider on the second call', async () => {
      // When
      await service.handle(handleArgument);

      // Then
      expect(
        cryptographyFcpServiceMock.computeIdentityHash,
      ).toHaveBeenCalledTimes(2);
      expect(
        cryptographyFcpServiceMock.computeIdentityHash,
      ).toHaveBeenNthCalledWith(2, idpIdentityMock);
    });

    it('should call computeSubV1 with entityId and rnippIdentityHash on first call', async () => {
      // When
      await service.handle(handleArgument);

      // Then
      expect(cryptographyFcpServiceMock.computeSubV1).toHaveBeenCalledTimes(2);
      expect(cryptographyFcpServiceMock.computeSubV1).toHaveBeenNthCalledWith(
        1,
        spMock.entityId,
        'spIdentityHash',
      );
    });

    it('should call computeSubV1 with spId and idpIdentityHash on the second call', async () => {
      // When
      await service.handle(handleArgument);

      // Then
      expect(cryptographyFcpServiceMock.computeSubV1).toHaveBeenCalledTimes(2);
      expect(cryptographyFcpServiceMock.computeSubV1).toHaveBeenNthCalledWith(
        2,
        sessionDataMock.spId,
        'idpIdentityHash',
      );
    });

    /**
     * @TODO #134 ETQ FC, je suis résiliant aux fails du RNIPP
     * Test when implemented
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/134
     *
     * // RNIPP resilience
     * it('Should pass if rnipp is down and account is known', async () => {});
     * it('Should throw if rnipp is down and account is unknown', async () => {});
     *
     * // Service provider usability
     * it('Should throw if service provider is not usable ', async () => {});
     */
  });

  describe('rnippCheck', () => {
    it('should not throw if rnipp service does not', async () => {
      // Then
      expect(
        service['rnippCheck'](spIdentityMock, reqMock),
      ).resolves.not.toThrow();
    });

    it('should return rnippIdentity', async () => {
      // When
      const result = await service['rnippCheck'](spIdentityMock, reqMock);
      // Then
      expect(result).toBe(spIdentityMock);
    });

    it('should publish events when searching', async () => {
      // When
      await service['rnippCheck'](spIdentityMock, reqMock);
      // Then
      expect(trackingMock.track).toHaveBeenCalledTimes(2);
      expect(trackingMock.track).toHaveBeenCalledWith(
        RnippRequestedEvent,
        expect.any(Object),
      );
      expect(trackingMock.track).toHaveBeenCalledWith(
        RnippReceivedValidEvent,
        expect.any(Object),
      );
    });

    it('should add interactionId and Ip address properties in published events', async () => {
      // Given
      const expectedEventStruct = {
        fc: { interactionId: '42' },
        ip: '123.123.123.123',
      };
      // When
      await service['rnippCheck'](spIdentityMock, reqMock);
      // Then
      expect(trackingMock.track).toHaveBeenCalledTimes(2);
      expect(trackingMock.track).toHaveBeenCalledWith(
        RnippRequestedEvent,
        expectedEventStruct,
      );
      expect(trackingMock.track).toHaveBeenCalledWith(
        RnippReceivedValidEvent,
        expectedEventStruct,
      );
    });
  });
});
