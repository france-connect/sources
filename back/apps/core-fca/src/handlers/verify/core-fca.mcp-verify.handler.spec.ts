import { Test, TestingModule } from '@nestjs/testing';

import { AccountBlockedException } from '@fc/account';
import { CoreAccountService, CoreAcrService } from '@fc/core';
import { CoreFcaAgentNotFromPublicServiceException } from '@fc/core-fca/exceptions';
import { CryptographyFcaService } from '@fc/cryptography-fca';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import {
  ServiceProviderAdapterMongoService,
  Types,
} from '@fc/service-provider-adapter-mongo';
import { SessionService } from '@fc/session';

import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { CoreFcaMcpVerifyHandler } from './core-fca.mcp-verify.handler';

describe('CoreFcaMcpVerifyHandler', () => {
  let service: CoreFcaMcpVerifyHandler;

  const loggerServiceMock = getLoggerMock();

  const accountIdMock = 'accountIdMock value';

  const coreAccountServiceMock = {
    checkIfAccountIsBlocked: jest.fn(),
    computeFederation: jest.fn(),
  };

  const coreAcrServiceMock = {
    checkIfAcrIsValid: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();

  const spIdentityMock = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'Edward',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    family_name: 'TEACH',
    email: 'eteach@fqdn.ext',
    type: Types.PUBLIC,
  };

  describe('handle with is_service_public true', () => {
    const idpIdentityMock = {
      sub: 'computedSubIdp',
      // Oidc Naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name: 'givenNameValue',
      uid: 'uidValue',
      // moncomptepro Naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      is_service_public: true,
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
      amr: ['pwd'],
    };

    const handleArgument = {
      sessionOidc: sessionServiceMock,
    };

    const cryptographyFcaServiceMock = {
      computeSubV1: jest.fn(),
      computeIdentityHash: jest.fn(),
    };

    const identityProviderAdapterMock = {
      getById: jest.fn(),
    };

    const serviceProviderAdapterMock = {
      getById: jest.fn(),
    };

    const { sub: _sub, ...idpIdentityMockCleaned } = idpIdentityMock;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          CoreFcaMcpVerifyHandler,
          SessionService,
          LoggerService,
          CoreAccountService,
          CoreAcrService,
          CryptographyFcaService,
          IdentityProviderAdapterMongoService,
          ServiceProviderAdapterMongoService,
        ],
      })
        .overrideProvider(LoggerService)
        .useValue(loggerServiceMock)
        .overrideProvider(SessionService)
        .useValue(sessionServiceMock)
        .overrideProvider(CoreAccountService)
        .useValue(coreAccountServiceMock)
        .overrideProvider(CoreAcrService)
        .useValue(coreAcrServiceMock)
        .overrideProvider(CryptographyFcaService)
        .useValue(cryptographyFcaServiceMock)
        .overrideProvider(IdentityProviderAdapterMongoService)
        .useValue(identityProviderAdapterMock)
        .overrideProvider(ServiceProviderAdapterMongoService)
        .useValue(serviceProviderAdapterMock)
        .compile();

      service = module.get<CoreFcaMcpVerifyHandler>(CoreFcaMcpVerifyHandler);

      jest.resetAllMocks();
      jest.restoreAllMocks();

      sessionServiceMock.get.mockReturnValue(sessionDataMock);
      serviceProviderAdapterMock.getById.mockReturnValue({
        type: Types.PUBLIC,
      });
      cryptographyFcaServiceMock.computeIdentityHash.mockReturnValueOnce(
        'spIdentityHash',
      );
      cryptographyFcaServiceMock.computeSubV1.mockReturnValueOnce(
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

    it('should not throw if verified', async () => {
      // Then
      await expect(service.handle(handleArgument)).resolves.not.toThrow();
    });

    // Dependencies sevices errors
    it('should throw if acr is not validated', async () => {
      // Given
      const errorMock = new Error('my error 1');
      coreAcrServiceMock.checkIfAcrIsValid.mockImplementation(() => {
        throw errorMock;
      });
      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
    });

    it('should throw if account is blocked', async () => {
      // Given
      const errorMock = new AccountBlockedException();
      coreAccountServiceMock.checkIfAccountIsBlocked.mockRejectedValueOnce(
        errorMock,
      );

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

    it('should call session set with amr parameter', async () => {
      // When
      await service.handle(handleArgument);
      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith({
        accountId: accountIdMock,
        amr: ['pwd'],
        idpIdentity: idpIdentityMock,
        spIdentity: {
          ...idpIdentityMockCleaned,
          // AgentConnect claims naming convention
          // eslint-disable-next-line @typescript-eslint/naming-convention
          idp_id: '42',
          // AgentConnect claims naming convention
          // eslint-disable-next-line @typescript-eslint/naming-convention
          idp_acr: 'eidas3',
        },
        subs: {
          // AgentConnect claims naming convention
          // eslint-disable-next-line @typescript-eslint/naming-convention
          sp_id: 'computedSubSp',
        },
      });
    });

    it('should call computeFederation()', async () => {
      // When
      await service.handle(handleArgument);
      // Then
      expect(coreAccountServiceMock.computeFederation).toHaveBeenCalledTimes(1);
      expect(coreAccountServiceMock.computeFederation).toHaveBeenCalledWith({
        key: sessionDataMock.spId,
        sub: 'computedSubSp',
        identityHash: 'spIdentityHash',
      });
    });

    it('should call computeIdentityHash with idp identity and idp id', async () => {
      // When
      await service.handle(handleArgument);

      // Then
      expect(
        cryptographyFcaServiceMock.computeIdentityHash,
      ).toHaveBeenCalledTimes(1);
      expect(
        cryptographyFcaServiceMock.computeIdentityHash,
      ).toHaveBeenNthCalledWith(1, sessionDataMock.idpId, idpIdentityMock);
    });

    it('should call compute Sub for Sp based on identity hash', async () => {
      // When
      await service.handle(handleArgument);

      // Then
      expect(cryptographyFcaServiceMock.computeSubV1).toHaveBeenCalledTimes(1);
      expect(cryptographyFcaServiceMock.computeSubV1).toHaveBeenNthCalledWith(
        1,
        sessionDataMock.spId,
        'spIdentityHash',
      );
    });

    it('should throw an error if computeFederation failed', async () => {
      // Given
      const errorMock = new Error('my error');
      coreAccountServiceMock.computeFederation.mockRejectedValueOnce(errorMock);

      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
    });

    it('should patch the session with idp and sp identity', async () => {
      // Given
      const calledMock = {
        idpIdentity: idpIdentityMock,
        spIdentity: {
          // Oidc naming convention
          // eslint-disable-next-line @typescript-eslint/naming-convention
          given_name: idpIdentityMock.given_name,
          uid: idpIdentityMock.uid,
          // AgentConnect claims naming convention
          // eslint-disable-next-line @typescript-eslint/naming-convention
          idp_id: sessionDataMock.idpId,
          // AgentConnect claims naming convention
          // eslint-disable-next-line @typescript-eslint/naming-convention
          idp_acr: sessionDataMock.idpAcr,
          // moncomptepro claims naming convention
          // eslint-disable-next-line @typescript-eslint/naming-convention
          is_service_public: idpIdentityMock.is_service_public,
        },
        subs: {
          // AgentConnect claims naming convention
          // eslint-disable-next-line @typescript-eslint/naming-convention
          sp_id: 'computedSubSp',
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

  describe('handle with is_service_public false and sp type is public', () => {
    const idpIdentityMock = {
      sub: 'computedSubIdp',
      // Oidc Naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name: 'givenNameValue',
      uid: 'uidValue',
      // moncomptepro Naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      is_service_public: false,
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
      amr: ['pwd'],
    };

    const cryptographyFcaServiceMock = {
      computeSubV1: jest.fn(),
      computeIdentityHash: jest.fn(),
    };

    const handleArgument = {
      sessionOidc: sessionServiceMock,
    };

    const identityProviderAdapterMock = {
      getById: jest.fn(),
    };

    const serviceProviderAdapterMock = {
      getById: jest.fn(),
    };

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          CoreFcaMcpVerifyHandler,
          SessionService,
          LoggerService,
          CoreAccountService,
          CoreAcrService,
          CryptographyFcaService,
          IdentityProviderAdapterMongoService,
          ServiceProviderAdapterMongoService,
        ],
      })
        .overrideProvider(LoggerService)
        .useValue(loggerServiceMock)
        .overrideProvider(SessionService)
        .useValue(sessionServiceMock)
        .overrideProvider(CoreAccountService)
        .useValue(coreAccountServiceMock)
        .overrideProvider(CoreAcrService)
        .useValue(coreAcrServiceMock)
        .overrideProvider(CryptographyFcaService)
        .useValue(cryptographyFcaServiceMock)
        .overrideProvider(IdentityProviderAdapterMongoService)
        .useValue(identityProviderAdapterMock)
        .overrideProvider(ServiceProviderAdapterMongoService)
        .useValue(serviceProviderAdapterMock)
        .compile();

      service = module.get<CoreFcaMcpVerifyHandler>(CoreFcaMcpVerifyHandler);

      jest.resetAllMocks();
      jest.restoreAllMocks();

      sessionServiceMock.get.mockReturnValue(sessionDataMock);
      cryptographyFcaServiceMock.computeIdentityHash.mockReturnValueOnce(
        'spIdentityHash',
      );
      cryptographyFcaServiceMock.computeSubV1.mockReturnValueOnce(
        'computedSubSp',
      );
      coreAccountServiceMock.computeFederation.mockResolvedValue(accountIdMock);

      serviceProviderAdapterMock.getById.mockReturnValue({
        type: Types.PUBLIC,
      });

      identityProviderAdapterMock.getById.mockResolvedValue({
        maxAuthorizedAcr: 'maxAuthorizedAcr value',
      });
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should throw an Invalid Publicness exception', async () => {
      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(
        CoreFcaAgentNotFromPublicServiceException,
      );
    });
  });

  describe('handle with is_service_public false and sp type is private', () => {
    const idpIdentityMock = {
      sub: 'computedSubIdp',
      // Oidc Naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name: 'givenNameValue',
      uid: 'uidValue',
      // moncomptepro Naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      is_service_public: false,
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
      amr: ['pwd'],
    };

    const cryptographyFcaServiceMock = {
      computeSubV1: jest.fn(),
      computeIdentityHash: jest.fn(),
    };

    const handleArgument = {
      sessionOidc: sessionServiceMock,
    };

    const identityProviderAdapterMock = {
      getById: jest.fn(),
    };

    const serviceProviderAdapterMock = {
      getById: jest.fn(),
    };

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          CoreFcaMcpVerifyHandler,
          SessionService,
          LoggerService,
          CoreAccountService,
          CoreAcrService,
          CryptographyFcaService,
          IdentityProviderAdapterMongoService,
          ServiceProviderAdapterMongoService,
        ],
      })
        .overrideProvider(LoggerService)
        .useValue(loggerServiceMock)
        .overrideProvider(SessionService)
        .useValue(sessionServiceMock)
        .overrideProvider(CoreAccountService)
        .useValue(coreAccountServiceMock)
        .overrideProvider(CoreAcrService)
        .useValue(coreAcrServiceMock)
        .overrideProvider(CryptographyFcaService)
        .useValue(cryptographyFcaServiceMock)
        .overrideProvider(IdentityProviderAdapterMongoService)
        .useValue(identityProviderAdapterMock)
        .overrideProvider(ServiceProviderAdapterMongoService)
        .useValue(serviceProviderAdapterMock)
        .compile();

      service = module.get<CoreFcaMcpVerifyHandler>(CoreFcaMcpVerifyHandler);

      jest.resetAllMocks();
      jest.restoreAllMocks();

      sessionServiceMock.get.mockReturnValue(sessionDataMock);
      cryptographyFcaServiceMock.computeIdentityHash.mockReturnValueOnce(
        'spIdentityHash',
      );
      cryptographyFcaServiceMock.computeSubV1.mockReturnValueOnce(
        'computedSubSp',
      );
      coreAccountServiceMock.computeFederation.mockResolvedValue(accountIdMock);

      serviceProviderAdapterMock.getById.mockReturnValue({
        type: Types.PRIVATE,
      });

      identityProviderAdapterMock.getById.mockResolvedValue({
        maxAuthorizedAcr: 'maxAuthorizedAcr value',
      });
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should not throw if verified', async () => {
      // Then
      await expect(service.handle(handleArgument)).resolves.not.toThrow();
    });
  });

  describe('handle without is_service_public', () => {
    const idpIdentityMock = {
      sub: 'computedSubIdp',
      // Oidc Naming convention
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name: 'givenNameValue',
      uid: 'uidValue',
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
      amr: ['pwd'],
    };

    const cryptographyFcaServiceMock = {
      computeSubV1: jest.fn(),
      computeIdentityHash: jest.fn(),
    };

    const handleArgument = {
      sessionOidc: sessionServiceMock,
    };

    const identityProviderAdapterMock = {
      getById: jest.fn(),
    };

    const serviceProviderAdapterMock = {
      getById: jest.fn(),
    };

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          CoreFcaMcpVerifyHandler,
          SessionService,
          LoggerService,
          CoreAccountService,
          CoreAcrService,
          CryptographyFcaService,
          IdentityProviderAdapterMongoService,
          ServiceProviderAdapterMongoService,
        ],
      })
        .overrideProvider(LoggerService)
        .useValue(loggerServiceMock)
        .overrideProvider(SessionService)
        .useValue(sessionServiceMock)
        .overrideProvider(CoreAccountService)
        .useValue(coreAccountServiceMock)
        .overrideProvider(CoreAcrService)
        .useValue(coreAcrServiceMock)
        .overrideProvider(CryptographyFcaService)
        .useValue(cryptographyFcaServiceMock)
        .overrideProvider(IdentityProviderAdapterMongoService)
        .useValue(identityProviderAdapterMock)
        .overrideProvider(ServiceProviderAdapterMongoService)
        .useValue(serviceProviderAdapterMock)
        .compile();

      service = module.get<CoreFcaMcpVerifyHandler>(CoreFcaMcpVerifyHandler);

      jest.resetAllMocks();
      jest.restoreAllMocks();

      sessionServiceMock.get.mockReturnValue(sessionDataMock);
      cryptographyFcaServiceMock.computeIdentityHash.mockReturnValueOnce(
        'spIdentityHash',
      );

      serviceProviderAdapterMock.getById.mockReturnValue({
        type: Types.PUBLIC,
      });

      cryptographyFcaServiceMock.computeSubV1.mockReturnValueOnce(
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

    it('should throw an error when is_service_public scope is missing', async () => {
      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(
        CoreFcaAgentNotFromPublicServiceException,
      );
    });
  });
});
