import { v4 as uuid } from 'uuid';

import { Test, TestingModule } from '@nestjs/testing';

import { AccountFca, AccountFcaService } from '@fc/account-fca';
import { ConfigService } from '@fc/config';
import { CoreAcrService } from '@fc/core';
import { CoreFcaAgentAccountBlockedException } from '@fc/core-fca/exceptions';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { OidcAcrService } from '@fc/oidc-acr';
import { SessionService } from '@fc/session';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { CoreFcaDefaultVerifyHandler } from './core-fca.default-verify.handler';

jest.mock('uuid');

describe('CoreFcaDefaultVerifyHandler', () => {
  let service: CoreFcaDefaultVerifyHandler;

  const uuidMock = jest.mocked(uuid);

  const loggerServiceMock = getLoggerMock();

  const accountIdMock = 'accountIdMock value';
  const universalSubMock = '0b3d4211-d85e-4839-b0ac-2c8a218fe4dd';

  const accountFcaMock = {
    id: accountIdMock,
    sub: universalSubMock,
    active: true,
  } as AccountFca;

  const coreAcrServiceMock = {
    checkIfAcrIsValid: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();

  const idpIdentityMock = {
    sub: 'computedSubIdp',
    given_name: 'givenNameValue',
    uid: 'uidValue',
    usual_name: 'usalNameValue',
    email: 'myemail@mail.fr',
  };

  const { sub: _sub, ...idpIdentityMockCleaned } = idpIdentityMock;

  const sessionDataMock = {
    idpId: '42',
    idpAcr: 'eidas3',
    idpName: 'my favorite Idp',
    idpIdentity: idpIdentityMock,
    spId: 'sp_id',
    spAcr: 'eidas3',
    spName: 'my great SP',
    spIdentity: idpIdentityMock,
    amr: ['pwd'],
  };

  const fcaIdentityMock = {
    ...idpIdentityMockCleaned,
    idp_id: sessionDataMock.idpId,
    idp_acr: sessionDataMock.idpAcr,
  };

  const handleArgument = {
    sessionOidc: sessionServiceMock,
  };

  const identityProviderAdapterMock = {
    getById: jest.fn(),
  };

  const idpAgentKeyMock = {
    idpSub: idpIdentityMock.sub,
    idpUid: idpIdentityMock.uid,
  };

  const accountFcaServiceMock = {
    createAccount: jest.fn(),
    getAccountByIdpAgentKeys: jest.fn(),
    upsertWithSub: jest.fn(),
  };

  const oidcAcrMock = {
    getInteractionAcr: jest.fn(),
  };
  const interactionAcrMock = 'interactionAcrMock';

  const configServiceMock = {
    get: jest.fn(),
  };

  const appConfigMock = {
    configuration: {
      claims: {
        amr: ['amr'],
        uid: ['uid'],
        openid: ['sub'],
        given_name: ['given_name'],
        email: ['email'],
        phone: ['phone_number'],
        organizational_unit: ['organizational_unit'],
        siren: ['siren'],
        siret: ['siret'],
        usual_name: ['usual_name'],
        belonging_population: ['belonging_population'],
        chorusdt: ['chorusdt:matricule', 'chorusdt:societe'],
        idp_id: ['idp_id'],
        idp_acr: ['idp_acr'],
        is_service_public: ['is_service_public'],
        groups: ['groups'],
        custom: ['custom'],
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreFcaDefaultVerifyHandler,
        SessionService,
        LoggerService,
        CoreAcrService,
        IdentityProviderAdapterMongoService,
        AccountFcaService,
        OidcAcrService,
        ConfigService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(CoreAcrService)
      .useValue(coreAcrServiceMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderAdapterMock)
      .overrideProvider(AccountFcaService)
      .useValue(accountFcaServiceMock)
      .overrideProvider(OidcAcrService)
      .useValue(oidcAcrMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<CoreFcaDefaultVerifyHandler>(
      CoreFcaDefaultVerifyHandler,
    );

    jest.resetAllMocks();
    jest.restoreAllMocks();

    sessionServiceMock.get.mockReturnValue(sessionDataMock);

    identityProviderAdapterMock.getById.mockResolvedValue({
      maxAuthorizedAcr: 'maxAuthorizedAcr value',
    });

    oidcAcrMock.getInteractionAcr.mockReturnValue(interactionAcrMock);

    configServiceMock.get.mockReturnValue(appConfigMock);

    service['expectedClaims'] = [
      'belonging_population',
      'chorusdt:matricule',
      'chorusdt:societe',
      'email',
      'given_name',
      'idp_acr',
      'idp_id',
      'organizational_unit',
      'phone_number',
      'uid',
      'siren',
      'siret',
      'sub',
      'uid',
      'usual_name',
      'custom',
      'is_service_public',
    ];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle()', () => {
    beforeEach(() => {
      const newSub = 'newSub';
      uuidMock.mockReturnValueOnce(newSub);

      const createOrUpdateAccountSpied = jest.spyOn<
        CoreFcaDefaultVerifyHandler,
        any
      >(service, 'createOrUpdateAccount');

      createOrUpdateAccountSpied.mockReturnValueOnce(accountFcaMock);
    });

    it('should not throw if verified', async () => {
      // Then
      await expect(service.handle(handleArgument)).resolves.not.toThrow();
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

    it('sould call createOrUpdateAccount with agent identity and idp id', async () => {
      // When

      const composeFcaIdentitySpied = jest.spyOn<
        CoreFcaDefaultVerifyHandler,
        any
      >(service, 'createOrUpdateAccount');

      await service.handle(handleArgument);

      // Then
      expect(composeFcaIdentitySpied).toHaveBeenCalledTimes(1);
      expect(composeFcaIdentitySpied).toHaveBeenCalledWith(
        idpIdentityMock,
        sessionDataMock.idpId,
      );
    });

    it('should throw if account is blocked', async () => {
      // Given
      const checkIfAccountIsBlockedSpied = jest.spyOn<
        CoreFcaDefaultVerifyHandler,
        any
      >(service, 'checkIfAccountIsBlocked');

      const errorMock = new CoreFcaAgentAccountBlockedException();
      checkIfAccountIsBlockedSpied.mockImplementation(() => {
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

    it('should call composeFcaIdentitySpied with idp identity, idp id and idp acr', async () => {
      // When
      const composeFcaIdentitySpied = jest.spyOn<
        CoreFcaDefaultVerifyHandler,
        any
      >(service, 'composeFcaIdentity');

      await service.handle(handleArgument);

      // Then
      expect(composeFcaIdentitySpied).toHaveBeenCalledTimes(1);
      expect(composeFcaIdentitySpied).toHaveBeenCalledWith(
        idpIdentityMock,
        sessionDataMock.idpId,
        sessionDataMock.idpAcr,
      );
    });

    it('should throw an error if composeFcaIdentity failed', async () => {
      // Given
      const composeFcaIdentitySpied = jest.spyOn<
        CoreFcaDefaultVerifyHandler,
        any
      >(service, 'composeFcaIdentity');

      const errorMock = new Error('my error');
      composeFcaIdentitySpied.mockImplementation(() => {
        throw errorMock;
      });

      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
    });

    it('should patch the session with idp and sp identity', async () => {
      // Given
      const calledMock = {
        idpIdentity: idpIdentityMock,
        interactionAcr: interactionAcrMock,
        spIdentity: {
          given_name: idpIdentityMock.given_name,
          uid: idpIdentityMock.uid,
          idp_id: sessionDataMock.idpId,
          idp_acr: sessionDataMock.idpAcr,
          email: idpIdentityMock.email,
          usual_name: idpIdentityMock.usual_name,
          custom: {},
        },
        subs: {
          sp_id: universalSubMock,
        },
        accountId: accountIdMock,
        amr: ['pwd'],
      };

      // When
      await service.handle(handleArgument);

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith(calledMock);
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
  });

  describe('createOrUpdateAccount()', () => {
    it('should updateAccountWithInteraction with correct parameters', async () => {
      // Given
      const updateAccountWithInteractionSpied = jest.spyOn<
        CoreFcaDefaultVerifyHandler,
        any
      >(service, 'updateAccountWithInteraction');

      const hasInteractionSpied = jest.spyOn<CoreFcaDefaultVerifyHandler, any>(
        service,
        'hasInteraction',
      );

      accountFcaServiceMock.getAccountByIdpAgentKeys.mockResolvedValueOnce(
        accountFcaMock,
      );

      hasInteractionSpied.mockResolvedValueOnce(true);

      // When
      await service['createOrUpdateAccount'](
        idpIdentityMock,
        sessionDataMock.idpId,
      );

      // Then
      expect(updateAccountWithInteractionSpied).toHaveBeenCalledTimes(1);
      expect(updateAccountWithInteractionSpied).toHaveBeenCalledWith(
        accountFcaMock,
        idpIdentityMock,
        sessionDataMock.idpId,
      );
    });

    it('should call accountService.upsertWithSub with correct parameters', async () => {
      // Given
      accountFcaServiceMock.getAccountByIdpAgentKeys.mockResolvedValueOnce(
        accountFcaMock,
      );

      const hasInteractionSpied = jest.spyOn<CoreFcaDefaultVerifyHandler, any>(
        service,
        'hasInteraction',
      );

      hasInteractionSpied.mockResolvedValueOnce(true);

      // When
      await service['createOrUpdateAccount'](
        idpIdentityMock,
        sessionDataMock.idpId,
      );

      // Then
      expect(accountFcaServiceMock.upsertWithSub).toHaveBeenCalledTimes(1);
      expect(accountFcaServiceMock.upsertWithSub).toHaveBeenCalledWith(
        accountFcaMock,
      );
    });

    it('it should call upsertWithSub with correct parameters', async () => {
      // Given
      accountFcaServiceMock.getAccountByIdpAgentKeys.mockResolvedValueOnce(
        accountFcaMock,
      );

      const hasInteractionSpied = jest.spyOn<CoreFcaDefaultVerifyHandler, any>(
        service,
        'hasInteraction',
      );

      hasInteractionSpied.mockResolvedValueOnce(true);

      // When
      await service['createOrUpdateAccount'](
        idpIdentityMock,
        sessionDataMock.idpId,
      );

      // Then
      expect(accountFcaServiceMock.upsertWithSub).toHaveBeenCalledTimes(1);
      expect(accountFcaServiceMock.upsertWithSub).toHaveBeenCalledWith(
        accountFcaMock,
      );
    });
  });

  describe('getIdpAgentKeys()', () => {
    it('should return a concatenation of idpUid and idpSub', () => {
      const result = service['getIdpAgentKeys'](
        sessionDataMock.idpId,
        idpIdentityMock.sub,
      );

      expect(result).toStrictEqual({
        idpUid: sessionDataMock.idpId,
        idpSub: idpIdentityMock.sub,
      });
    });
  });

  describe('composeFcaIdentity()', () => {
    it('should return a clean identity', () => {
      const result = service['composeFcaIdentity'](
        idpIdentityMock,
        sessionDataMock.idpId,
        sessionDataMock.idpAcr,
      );

      const expected = {
        ...idpIdentityMockCleaned,
        custom: {},
        idp_id: '42',
        idp_acr: 'eidas3',
      };

      expect(result).toStrictEqual(expected);
    });
  });

  describe('storeIdentityWithSessionService()', () => {
    it('should set the Oidc session', () => {
      service['storeIdentityWithSessionService'](
        sessionServiceMock,
        accountFcaMock.sub,
        idpIdentityMock,
        accountIdMock,
        interactionAcrMock,
      );

      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
    });

    it('should call session set with amr parameters', () => {
      // When
      service['storeIdentityWithSessionService'](
        sessionServiceMock,
        accountFcaMock.sub,
        fcaIdentityMock,
        accountIdMock,
        interactionAcrMock,
      );

      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith({
        accountId: accountIdMock,
        amr: ['pwd'],
        idpIdentity: idpIdentityMock,
        interactionAcr: interactionAcrMock,
        spIdentity: {
          ...idpIdentityMockCleaned,
          idp_id: sessionDataMock.idpId,
          idp_acr: sessionDataMock.idpAcr,
        },
        subs: {
          sp_id: universalSubMock,
        },
      });
    });
  });

  describe('checkIfAccountIsBlocked()', () => {
    it('should throw an error if account is not active', () => {
      accountFcaMock.active = false;

      expect(() => service['checkIfAccountIsBlocked'](accountFcaMock)).toThrow(
        new CoreFcaAgentAccountBlockedException(),
      );
    });

    it('should not throw an error if account is active', () => {
      accountFcaMock.active = true;

      expect(() =>
        service['checkIfAccountIsBlocked'](accountFcaMock),
      ).not.toThrow();
    });
  });

  describe('getAccountForInteraction()', () => {
    it('should call getAccountByIdpAgentKeys with correct parameters', async () => {
      // Given
      const idpAgentKeys = {
        idpSub: idpIdentityMock.sub,
        idpUid: sessionDataMock.idpId,
      };

      // When
      await service['getAccountForInteraction'](
        idpIdentityMock,
        sessionDataMock.idpId,
      );

      // Then
      expect(
        accountFcaServiceMock.getAccountByIdpAgentKeys,
      ).toHaveBeenCalledTimes(1);
      expect(
        accountFcaServiceMock.getAccountByIdpAgentKeys,
      ).toHaveBeenCalledWith(idpAgentKeys);
    });

    it('should return the account if it exists', async () => {
      // Given
      accountFcaServiceMock.getAccountByIdpAgentKeys.mockResolvedValueOnce(
        accountFcaMock,
      );

      // When
      const result = await service['getAccountForInteraction'](
        idpIdentityMock,
        sessionDataMock.idpId,
      );

      // Then
      expect(result).toBe(accountFcaMock);
    });

    it('should create a new account if it does not exist', async () => {
      // Given
      const customAccountFcaMock = { ...accountFcaMock, sub: 'custom-sub' };
      accountFcaServiceMock.createAccount.mockReturnValueOnce(
        customAccountFcaMock,
      );

      accountFcaServiceMock.getAccountByIdpAgentKeys.mockResolvedValueOnce(
        null,
      );

      // When
      const result = await service['getAccountForInteraction'](
        idpIdentityMock,
        sessionDataMock.idpId,
      );

      // Then
      expect(result).toEqual(customAccountFcaMock);
    });
  });

  describe('updateAccountWithInteraction()', () => {
    it('should add an interaction if the account does not have one', () => {
      // Given
      const account = {
        idpIdentityKeys: [],
      } as unknown as AccountFca;

      // When
      service['updateAccountWithInteraction'](
        account,
        idpIdentityMock,
        sessionDataMock.idpId,
      );

      // Then
      expect(account.idpIdentityKeys).toEqual([
        {
          idpUid: sessionDataMock.idpId,
          idpSub: idpIdentityMock.sub,
        },
      ]);
    });

    it('should not add an interaction if the account already has one', () => {
      // Given
      const account = {
        idpIdentityKeys: [
          {
            idpSub: idpIdentityMock.sub,
            idpUid: sessionDataMock.idpId,
          },
        ],
      } as AccountFca;

      // When
      service['updateAccountWithInteraction'](
        account,
        idpIdentityMock,
        sessionDataMock.idpId,
      );

      // Then
      expect(account.idpIdentityKeys).toHaveLength(1);
    });

    it('should update the last connection date', () => {
      // Given
      const account = {
        idpIdentityKeys: [idpAgentKeyMock],
      } as AccountFca;

      // When
      service['updateAccountWithInteraction'](
        account,
        idpIdentityMock,
        sessionDataMock.idpId,
      );

      // Then
      expect(account.lastConnection).toBeInstanceOf(Date);
    });
  });

  describe('hasInteraction()', () => {
    it('should return true if the account has an interaction', () => {
      // Given
      const account = {
        idpIdentityKeys: [idpAgentKeyMock],
      } as AccountFca;

      // When
      const result = service['hasInteraction'](account, idpIdentityMock.sub);

      // Then
      expect(result).toBe(true);
    });

    it('should return false if the account does not have an interaction', () => {
      // Given
      const account = {
        idpIdentityKeys: [
          {
            idpUid: '',
            idpSub: '',
          },
        ],
      } as AccountFca;

      // When
      const result = service['hasInteraction'](account, idpIdentityMock.sub);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('customizeIdentity()', () => {
    const identityMock = {
      sub: '7396c91e-b9f2-4f9d-8547-5e9b3332725b',
      uid: '1',
      given_name: 'Angela Claire Louise',
      usual_name: 'DUBOIS',
      email: 'test@abcd.com',
      siren: '343293775',
      siret: '34329377500037',
      organizational_unit: 'comptabilite',
      belonging_population: 'agent',
      phone_number: '+331-12-44-45-23',
      'chorusdt:matricule': 'USER_AGC',
      'chorusdt:societe': 'CHT',
      idp_id: 'fia1v2',
      idp_acr: 'eidas1',
    };

    it('should return an identity with no "custom" property when identity has no unknown property', () => {
      // Then
      expect(service['customizeIdentity'](identityMock)).toStrictEqual({
        ...identityMock,
        custom: {},
      });
    });

    it('should return a customized identity with custom property when identity has at least one property non recognized as claims', () => {
      // Given
      const customizedIdentity = {
        ...identityMock,
        unexpected: 'not in claims',
      };

      // Then
      const { unexpected: _, ...cleanedIdentity } = customizedIdentity;
      expect(service['customizeIdentity'](customizedIdentity)).toStrictEqual({
        ...cleanedIdentity,
        custom: { unexpected: 'not in claims' },
      });
    });

    it('should return a customized identity able to handle a custom field in idp payload', () => {
      // Given
      const customizedIdentity = {
        ...identityMock,
        custom: 'not in claims',
      };

      const { custom: _, ...cleanedIdentity } = customizedIdentity;

      // Then
      expect(service['customizeIdentity'](customizedIdentity)).toStrictEqual({
        ...cleanedIdentity,
        custom: { custom: 'not in claims' },
      });
    });

    it('should return a customized identity able to handle a nested field in idp payload', () => {
      // Given
      const customizedIdentity = {
        ...identityMock,
        security: { header: 'not in claims' },
        options: ['not in claims', 'still not in claims'],
      };

      const {
        security: _security,
        options: _options,
        ...cleanedIdentity
      } = customizedIdentity;

      // Then
      expect(service['customizeIdentity'](customizedIdentity)).toStrictEqual({
        ...cleanedIdentity,
        custom: {
          security: { header: 'not in claims' },
          options: ['not in claims', 'still not in claims'],
        },
      });
    });
  });

  describe('onModuleInit()', () => {
    it('should call configService.get', () => {
      service.onModuleInit();

      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('getExpectedClaims()', () => {
    it('should return the expected claims', () => {
      service['expectedClaims'] = ['sub', 'email', 'given_name'];
    });
  });
});
