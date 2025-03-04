import { Test, TestingModule } from '@nestjs/testing';

import { Account, AccountBlockedException, AccountService } from '@fc/account';
import { RequiredExcept } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CoreAccountService, CoreAcrService } from '@fc/core';
import { IdentitySource } from '@fc/core-fcp/enums';
import { CryptographyFcpService } from '@fc/cryptography-fcp';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity } from '@fc/oidc';
import { OidcAcrService } from '@fc/oidc-acr';
import { RnippPivotIdentity, RnippService } from '@fc/rnipp';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { SessionService } from '@fc/session';
import { TrackedEventContextInterface, TrackingService } from '@fc/tracking';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { CoreFcpDefaultVerifyHandler } from './core-fcp-default-verify.handler';

describe('CoreFcpDefaultVerifyHandler', () => {
  let service: CoreFcpDefaultVerifyHandler;

  const loggerServiceMock = getLoggerMock();

  const uidMock = '42';

  const getInteractionResultMock = {
    prompt: {},

    params: {
      acr_values: 'eidas3',
      client_id: 'spId',
    },
    uid: uidMock,
  };
  const getInteractionMock = jest.fn();

  const sessionServiceMock = getSessionServiceMock();

  const rnippServiceMock = {
    check: jest.fn(),
  };

  const spIdentityMock = {
    given_name: 'Edward',
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
    TrackedEventsMap: {
      FC_REQUESTED_RNIPP: {},
      FC_RECEIVED_VALID_RNIPP: {},
    },
  };

  const accountIdMock = 'accountIdMock value';

  const coreAccountServiceMock = {
    computeFederation: jest.fn(),
    checkIfIdpIsBlockedForAccount: jest.fn(),
  };

  const coreAcrServiceMock = {
    checkIfAcrIsValid: jest.fn(),
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

  const rnippIdentityMock = {
    gender: 'gender',
    given_name: 'given_name',
    given_name_array: ['given_name_array'],
    family_name: 'family_name',
    birthdate: 'birthdate',
    birthplace: 'birthplace',
    birthcountry: 'birthcountry',
  };
  const rnippClaims = {
    rnipp_gender: 'gender',
    rnipp_given_name: 'given_name',
    rnipp_given_name_array: ['given_name_array'],
    rnipp_family_name: 'family_name',
    rnipp_birthdate: 'birthdate',
    rnipp_birthplace: 'birthplace',
    rnipp_birthcountry: 'birthcountry',
  };
  const spMock = {
    key: '123456',
    entityId: 'AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHH',
  };

  const serviceProviderMock = {
    getById: jest.fn(),
  };

  const cryptographyFcpServiceMock = {
    computeSubV1: jest.fn(),
    computeIdentityHash: jest.fn(),
  };

  const accountDataMock = {
    active: true,
    preferences: {
      idpSettings: {
        isExcludeList: true,
        list: ['fip3-low'],
      },
    },
    identityHash: 'spIdentityHash',
  };

  const accountServiceMock = {
    getAccountByIdentityHash: jest.fn(),
  };

  const configReturnedValueMock = {
    useIdentityFrom: IdentitySource.RNIPP,
  };

  const identityProviderAdapterMock = {
    getById: jest.fn(),
  };

  const oidcAcrMock = {
    getInteractionAcr: jest.fn(),
  };
  const interactionAcrMock = 'interactionAcrMock';

  const trackingContext = {} as unknown as TrackedEventContextInterface;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        CoreAccountService,
        CoreAcrService,
        CoreFcpDefaultVerifyHandler,
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
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(CoreAccountService)
      .useValue(coreAccountServiceMock)
      .overrideProvider(CoreAcrService)
      .useValue(coreAcrServiceMock)
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
      .overrideProvider(AccountService)
      .useValue(accountServiceMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderAdapterMock)
      .overrideProvider(OidcAcrService)
      .useValue(oidcAcrMock)
      .compile();

    service = module.get<CoreFcpDefaultVerifyHandler>(
      CoreFcpDefaultVerifyHandler,
    );

    jest.resetAllMocks();

    getInteractionMock.mockResolvedValue(getInteractionResultMock);
    sessionServiceMock.get.mockReturnValue(sessionDataMock);
    rnippServiceMock.check.mockResolvedValue(spIdentityMock);
    cryptographyFcpServiceMock.computeIdentityHash.mockReturnValueOnce(
      'spIdentityHash',
    );
    cryptographyFcpServiceMock.computeSubV1.mockReturnValueOnce(
      'computedSubSp',
    );

    coreAccountServiceMock.computeFederation.mockResolvedValue(accountIdMock);

    accountServiceMock.getAccountByIdentityHash.mockResolvedValueOnce(
      accountDataMock,
    );
    configServiceMock.get.mockReturnValue(configReturnedValueMock);

    identityProviderAdapterMock.getById.mockResolvedValue({
      maxAuthorizedAcr: 'maxAuthorizedAcr value',
    });
    oidcAcrMock.getInteractionAcr.mockReturnValue(interactionAcrMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle', () => {
    const handleArgument = {
      sessionOidc: sessionServiceMock,
      trackingContext,
    };
    beforeEach(() => {
      serviceProviderMock.getById.mockResolvedValue(spMock);
      service['retrieveRnippIdentity'] = jest
        .fn()
        .mockResolvedValueOnce(rnippIdentityMock);
    });

    it('should not throw if verified', async () => {
      // Then
      await expect(service.handle(handleArgument)).resolves.not.toThrow();
    });

    it('should call checkAccountBlocked', async () => {
      // Given
      service['checkAccountBlocked'] = jest.fn();
      // When
      await service.handle(handleArgument);
      // Then
      expect(service['checkAccountBlocked']).toHaveBeenCalledTimes(1);
      expect(service['checkAccountBlocked']).toHaveBeenCalledWith(
        accountDataMock,
      );
    });

    it('should throw if acr is not validated', async () => {
      // Given
      const errorMock = new Error('my error 1');
      coreAcrServiceMock.checkIfAcrIsValid.mockImplementation(() => {
        throw errorMock;
      });
      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
    });

    it('should throw if identity provider is not usable', async () => {
      // Given
      const errorMock = new Error('my error');
      sessionServiceMock.get.mockImplementationOnce(() => {
        throw errorMock;
      });
      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
    });

    it('should throw if service Provider service fails', async () => {
      // Given
      const errorMock = new Error('my error');
      serviceProviderMock.getById.mockReset().mockRejectedValueOnce(errorMock);

      // When
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
    });

    it('should throw if rnipp check refuses identity', async () => {
      // Given
      const errorMock = new Error('my error');
      service['retrieveRnippIdentity'] = jest
        .fn()
        .mockRejectedValueOnce(errorMock);
      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
    });

    it('should throw if identity storage for service provider fails', async () => {
      // Given
      const errorMock = new Error('my error');
      sessionServiceMock.set.mockImplementationOnce(() => {
        throw errorMock;
      });
      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
    });

    it('should call session set with amr parameter', async () => {
      // Given
      const buildRnippClaimsResult = {
        foo: 'bar',
      };
      const buildSpIdentityResult = {
        email: 'email',
        birthdate: 'foo',
        sub: 'computedSubSp',
      };
      const technicalClaims = { tech: 'claims' };
      service['buildRnippClaims'] = jest
        .fn()
        .mockReturnValueOnce(buildRnippClaimsResult);
      service['buildSpIdentity'] = jest
        .fn()
        .mockReturnValueOnce(buildSpIdentityResult);

      service['getTechnicalClaims'] = jest
        .fn()
        .mockReturnValueOnce(technicalClaims);
      // When
      await service.handle(handleArgument);
      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith({
        accountId: accountIdMock,
        idpIdentity: idpIdentityMock,
        rnippIdentity: rnippIdentityMock,
        interactionAcr: interactionAcrMock,
        spIdentity: {
          ...idpIdentityMock,
          sub: 'computedSubSp',
          email: 'email',
          birthdate: 'foo',
          ...technicalClaims,
        },
        subs: {
          sp_id: 'computedSubSp',
        },
      });
    });

    it('should call computeFederation()', async () => {
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

    it('should call computeIdentityHash with rnipp identity', async () => {
      // When
      await service.handle(handleArgument);

      // Then
      expect(
        cryptographyFcpServiceMock.computeIdentityHash,
      ).toHaveBeenCalledTimes(1);
      expect(
        cryptographyFcpServiceMock.computeIdentityHash,
      ).toHaveBeenCalledWith(rnippIdentityMock);
    });

    it('should call computeSubV1 with entityId and rnippIdentityHash', async () => {
      // When
      await service.handle(handleArgument);

      // Then
      expect(cryptographyFcpServiceMock.computeSubV1).toHaveBeenCalledTimes(1);
      expect(cryptographyFcpServiceMock.computeSubV1).toHaveBeenCalledWith(
        spMock.entityId,
        'spIdentityHash',
      );
    });

    it('should call buildSpIdentity with sub, idpIdentity and rnippIdentity', async () => {
      // Given
      service['buildSpIdentity'] = jest
        .fn()
        .mockReturnValue({ sub: idpIdentityMock.sub });
      // When
      await service.handle(handleArgument);
      // Then
      expect(service['buildSpIdentity']).toHaveBeenCalledTimes(1);
      expect(service['buildSpIdentity']).toHaveBeenCalledWith(
        idpIdentityMock,
        rnippIdentityMock,
      );
    });

    /**
     * @TODO #134 ETQ FC, je suis résiliant aux fails du RNIPP
     * Test when implemented
     * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/134
     *
     * // RNIPP resilience
     * it('should pass if rnipp is down and account is known', async () => {});
     * it('should throw if rnipp is down and account is unknown', async () => {});
     *
     * // Service provider usability
     * it('should throw if service provider is not usable ', async () => {});
     */
  });

  describe('getTechnicalClaims', () => {
    it('should return technical claims', () => {
      // Given
      const idpId = Symbol('idpId') as unknown as string;
      // When
      const result = service['getTechnicalClaims'](idpId);
      // Then
      expect(result).toEqual({
        idp_id: idpId,
      });
    });
  });

  describe('checkAccountBlocked', () => {
    it('should throw if account is blocked', () => {
      // Given
      const accountMock = { active: false } as Account;
      // Then
      expect(() => service['checkAccountBlocked'](accountMock)).toThrow(
        AccountBlockedException,
      );
    });

    it('should NOT throw if account is not blocked', () => {
      // Given
      const accountMock = { active: true } as Account;
      // Then
      expect(() => service['checkAccountBlocked'](accountMock)).not.toThrow();
    });

    it('should NOT throw if account does not exists', () => {
      // Given
      const accountMock = { id: null } as Account;
      // Then
      expect(() => service['checkAccountBlocked'](accountMock)).not.toThrow();
    });
  });

  describe('getSub', () => {
    const identityHashMock = 'identityHashMockValue';

    it('should use existing sub', () => {
      // Given
      const subFromAccount = 'subMockValue';
      const accountMock = {
        active: true,
        spFederation: {
          [spMock.entityId]: subFromAccount,
        },
      } as Account;

      // When
      const result = service['getSub'](
        accountMock,
        identityHashMock,
        spMock.entityId,
      );

      // Then
      expect(result).toBe(subFromAccount);
    });

    it('should use existing sub using old spFederation format', () => {
      // Given
      const subFromAccount = 'subMockValue';
      const accountMock = {
        active: true,
        spFederation: {
          [spMock.entityId]: {
            sub: subFromAccount,
          },
        },
      } as Account;

      // When
      const result = service['getSub'](
        accountMock,
        identityHashMock,
        spMock.entityId,
      );

      // Then
      expect(result).toBe(subFromAccount);
    });

    it('should use newly generated sub', () => {
      // Given
      const accountMock = {
        active: true,
      } as Account;

      const generatedSubMock = 'generatedSubMockValue';
      cryptographyFcpServiceMock.computeSubV1
        .mockReset()
        .mockReturnValueOnce(generatedSubMock);

      // When
      const result = service['getSub'](
        accountMock,
        identityHashMock,
        spMock.entityId,
      );

      // Then
      expect(result).toBe(generatedSubMock);
    });
  });

  describe('buildSpIdentity', () => {
    beforeEach(() => {
      serviceProviderMock.getById.mockResolvedValue(spMock);
    });

    it('should call buildFromRnippIdentity when RNIPP identity is selected in configuration', () => {
      // Given
      const configReturnedValueMock = { useIdentityFrom: IdentitySource.RNIPP };
      configServiceMock.get.mockReturnValue(configReturnedValueMock);
      service['buildFromRnippIdentity'] = jest.fn();
      // When
      service['buildSpIdentity'](idpIdentityMock, rnippIdentityMock);
      // Then
      expect(service['buildFromRnippIdentity']).toHaveBeenCalled();
      expect(service['buildFromRnippIdentity']).toHaveBeenCalledTimes(1);
    });

    it('should call buildFromIdpIdentity when IDP identity is selected in configuration', () => {
      // Given
      const configReturnedValueMock = { useIdentityFrom: IdentitySource.IDP };
      configServiceMock.get.mockReturnValue(configReturnedValueMock);
      service['buildFromIdpIdentity'] = jest.fn();
      // When
      service['buildSpIdentity'](idpIdentityMock, rnippIdentityMock);
      // Then
      expect(service['buildFromIdpIdentity']).toHaveBeenCalled();
      expect(service['buildFromIdpIdentity']).toHaveBeenCalledTimes(1);
    });
  });

  describe('buildFromIdpIdentity', () => {
    beforeEach(() => {
      const configReturnedValueMock = { useIdentityFrom: IdentitySource.IDP };
      serviceProviderMock.getById.mockResolvedValue(spMock);
      configServiceMock.get.mockReturnValue(configReturnedValueMock);
    });

    it('should return valide identity when IDP identity is selected in configuration', () => {
      // Given
      service['buildRnippClaims'] = jest.fn().mockReturnValue(rnippClaims);
      // When
      const buildFromIdpIdentityResult = service['buildFromIdpIdentity'](
        idpIdentityMock,
        rnippIdentityMock,
      );
      // Then
      expect(buildFromIdpIdentityResult).toEqual({
        ...rnippClaims,
        ...idpIdentityMock,
        given_name_array: rnippIdentityMock.given_name_array,
      });
    });
  });

  describe('buildFromRnippIdentity', () => {
    const idpIdentityMock = {
      sub: 'some idpSub',
      email: 'emailMock',
      birthdate: 'idpBirthdateMock',
      preferred_username: 'preferredUsernameMock',
    };

    beforeEach(() => {
      const configReturnedValueMock = { useIdentityFrom: IdentitySource.RNIPP };
      serviceProviderMock.getById.mockResolvedValue(spMock);
      configServiceMock.get.mockReturnValue(configReturnedValueMock);
    });

    it('should return valide identity when RNIPP identity is selected in configuration', () => {
      // Given
      service['buildRnippClaims'] = jest.fn().mockReturnValue(rnippClaims);
      // When
      const buildFromRnippIdentityResult = service['buildFromRnippIdentity'](
        rnippIdentityMock,
        idpIdentityMock,
      );
      // Then
      expect(buildFromRnippIdentityResult).toEqual({
        ...rnippIdentityMock,
        idp_birthdate: idpIdentityMock.birthdate,
        email: idpIdentityMock.email,
        preferred_username: idpIdentityMock.preferred_username,
      });
    });
  });

  describe('rnippCheck', () => {
    it('should not throw if rnipp service does not', async () => {
      // Then
      await expect(
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
        trackingMock.TrackedEventsMap.FC_REQUESTED_RNIPP,
        expect.any(Object),
      );
      expect(trackingMock.track).toHaveBeenCalledWith(
        trackingMock.TrackedEventsMap.FC_RECEIVED_VALID_RNIPP,
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
        trackingMock.TrackedEventsMap.FC_REQUESTED_RNIPP,
        expectedEventStruct,
      );
      expect(trackingMock.track).toHaveBeenCalledWith(
        trackingMock.TrackedEventsMap.FC_RECEIVED_VALID_RNIPP,
        expectedEventStruct,
      );
    });
  });

  describe('buildRnippClaims', () => {
    it('should return properties prefixed with "rnipp"', () => {
      // Given
      const input = {
        gender: Symbol('gender value'),
        given_name: Symbol('given name value'),
        family_name: Symbol('family_name'),
        birthdate: Symbol('birthdate value'),
        birthplace: Symbol('birthplace value'),
        birthcountry: Symbol('birthcountry value'),
      };
      // When
      const result = service['buildRnippClaims'](
        input as unknown as RnippPivotIdentity,
      );
      // Then
      expect(result).toEqual({
        rnipp_gender: input.gender,
        rnipp_given_name: input.given_name,
        rnipp_family_name: input.family_name,
        rnipp_birthdate: input.birthdate,
        rnipp_birthplace: input.birthplace,
        rnipp_birthcountry: input.birthcountry,
      });
    });
  });

  describe('retrieveRnippIdentity()', () => {
    const idpIdentityMock = {} as unknown as IOidcIdentity;

    it('should retrieve rnippIdentity from session', async () => {
      // Given
      const isSso = false;
      service['rnippCheck'] = jest
        .fn()
        .mockResolvedValueOnce(rnippIdentityMock);
      // When
      const result = await service['retrieveRnippIdentity'](
        isSso,
        sessionServiceMock,
        idpIdentityMock,
        trackingContext,
      );
      // Then
      expect(result).toEqual(rnippIdentityMock);
    });

    it('should retrieve rnippIdentity from the method rnippCheck', async () => {
      // Given
      const isSso = true;
      sessionServiceMock.get.mockReturnValue(rnippIdentityMock);
      // When
      const result = await service['retrieveRnippIdentity'](
        isSso,
        sessionServiceMock,
        idpIdentityMock,
        trackingContext,
      );
      // Then
      expect(result).toEqual(rnippIdentityMock);
    });
  });
});
