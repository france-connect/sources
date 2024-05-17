import { v4 as uuid } from 'uuid';

import { Test, TestingModule } from '@nestjs/testing';

import { AccountFca, AccountFcaService } from '@fc/account-fca';
import { CoreAcrService } from '@fc/core';
import {
  CoreFcaAgentAccountBlockedException,
  CoreFcaAgentNotFromPublicServiceException,
} from '@fc/core-fca/exceptions';
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

jest.mock('uuid');

describe('CoreFcaMcpVerifyHandler', () => {
  let service: CoreFcaMcpVerifyHandler;

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

  const serviceProviderAdapterMock = {
    getById: jest.fn(),
  };

  const sessionServiceMock = getSessionServiceMock();

  const idpIdentityMock = {
    sub: 'computedSubIdp',
    // Oidc Naming convention
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'givenNameValue',
    uid: 'uidValue',
    // Oidc Naming convention
    // eslint-disable-next-line @typescript-eslint/naming-convention
    usual_name: 'usalNameValue',
    email: 'myemail@mail.fr',
    // Oidc Naming convention
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
    spIdentity: idpIdentityMock,
    amr: ['pwd'],
  };

  const handleArgument = {
    sessionOidc: sessionServiceMock,
  };

  const identityProviderAdapterMock = {
    getById: jest.fn(),
  };

  const accountFcaServiceMock = {
    isBlocked: jest.fn(),
    saveInteraction: jest.fn(),
    getAccountByIdpAgentKeys: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreFcaMcpVerifyHandler,
        SessionService,
        LoggerService,
        CoreAcrService,
        IdentityProviderAdapterMongoService,
        AccountFcaService,
        ServiceProviderAdapterMongoService,
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
      .overrideProvider(ServiceProviderAdapterMongoService)
      .useValue(serviceProviderAdapterMock)
      .compile();

    service = module.get<CoreFcaMcpVerifyHandler>(CoreFcaMcpVerifyHandler);

    jest.resetAllMocks();
    jest.restoreAllMocks();

    sessionServiceMock.get.mockReturnValue(sessionDataMock);

    identityProviderAdapterMock.getById.mockResolvedValue({
      maxAuthorizedAcr: 'maxAuthorizedAcr value',
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle()', () => {
    beforeEach(() => {
      const newSub = 'newSub';
      uuidMock.mockReturnValueOnce(newSub);

      const createOrUpdateAccountSpied = jest.spyOn<
        CoreFcaMcpVerifyHandler,
        any
      >(service, 'createOrUpdateAccount');

      createOrUpdateAccountSpied.mockReturnValueOnce(accountFcaMock);

      // by default accept only public
      serviceProviderAdapterMock.getById.mockReturnValue({
        type: Types.PUBLIC,
      });
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

    it('should call createOrUpdateAccount with agent identity and idp id', async () => {
      // When

      const composeFcaIdentitySpied = jest.spyOn<CoreFcaMcpVerifyHandler, any>(
        service,
        'createOrUpdateAccount',
      );

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
        CoreFcaMcpVerifyHandler,
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
      const composeFcaIdentitySpied = jest.spyOn<CoreFcaMcpVerifyHandler, any>(
        service,
        'composeFcaIdentity',
      );

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
      const composeFcaIdentitySpied = jest.spyOn<CoreFcaMcpVerifyHandler, any>(
        service,
        'composeFcaIdentity',
      );

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
          email: idpIdentityMock.email,
          // Oidc Naming convention
          // eslint-disable-next-line @typescript-eslint/naming-convention
          usual_name: idpIdentityMock.usual_name,
          // Oidc Naming convention
          // eslint-disable-next-line @typescript-eslint/naming-convention
          is_service_public: true,
        },
        subs: {
          // AgentConnect claims naming convention
          // eslint-disable-next-line @typescript-eslint/naming-convention
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

    it('should throw if is_service_public is false and sp refuses private', async () => {
      // Given
      idpIdentityMock.is_service_public = false;

      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(
        new CoreFcaAgentNotFromPublicServiceException(),
      );
    });

    it('should not throw if is_service_public is false and sp accepts private', async () => {
      // Given
      idpIdentityMock.is_service_public = false;
      serviceProviderAdapterMock.getById.mockReturnValue({
        type: Types.PRIVATE,
      });

      // Then
      await expect(service.handle(handleArgument)).resolves.not.toThrow();
    });

    it('should throw when is_service_public scope is missing and sp does not accept private', async () => {
      // Given
      idpIdentityMock.is_service_public = undefined;

      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(
        new CoreFcaAgentNotFromPublicServiceException(),
      );
    });

    it('should not throw when is_service_public scope is missing if sp accepts private', async () => {
      // Given
      idpIdentityMock.is_service_public = undefined;
      serviceProviderAdapterMock.getById.mockReturnValue({
        type: Types.PRIVATE,
      });

      // Then
      await expect(service.handle(handleArgument)).resolves.not.toThrow();
    });
  });
});
