import { Test, TestingModule } from '@nestjs/testing';

import { AccountBlockedException } from '@fc/account';
import { CoreAccountService, CoreAcrService } from '@fc/core';
import { CryptographyFcaService } from '@fc/cryptography-fca';
import { LoggerService } from '@fc/logger-legacy';
import { SessionService } from '@fc/session';

import { CoreFcaDefaultVerifyHandler } from './core-fca.default-verify.handler';

describe('CoreFcaDefaultVerifyHandler', () => {
  let service: CoreFcaDefaultVerifyHandler;

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    trace: jest.fn(),
  };

  const accountIdMock = 'accountIdMock value';

  const coreAccountServiceMock = {
    checkIfAccountIsBlocked: jest.fn(),
    computeFederation: jest.fn(),
  };

  const coreAcrServiceMock = {
    checkIfAcrIsValid: jest.fn(),
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
    sub: 'computedSubIdp',
    // Oidc Naming convention
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'givenNameValue',
    uid: 'uidValue',
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreFcaDefaultVerifyHandler,
        SessionService,
        LoggerService,
        CoreAccountService,
        CoreAcrService,
        CryptographyFcaService,
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
      .compile();

    service = module.get<CoreFcaDefaultVerifyHandler>(
      CoreFcaDefaultVerifyHandler,
    );

    jest.resetAllMocks();
    jest.restoreAllMocks();

    sessionServiceMock.get.mockResolvedValue(sessionDataMock);
    cryptographyFcaServiceMock.computeIdentityHash.mockReturnValueOnce(
      'spIdentityHash',
    );
    cryptographyFcaServiceMock.computeSubV1.mockReturnValueOnce(
      'computedSubSp',
    );
    coreAccountServiceMock.computeFederation.mockResolvedValue(accountIdMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handle', () => {
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

    it('Should throw if account is blocked', async () => {
      // Given
      const errorMock = new AccountBlockedException();
      coreAccountServiceMock.checkIfAccountIsBlocked.mockRejectedValueOnce(
        errorMock,
      );

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

    it('Should call session set with amr parameter', async () => {
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

    it('Should call computeFederation()', async () => {
      // When
      await service.handle(handleArgument);
      // Then
      expect(coreAccountServiceMock.computeFederation).toHaveBeenCalledTimes(1);
      expect(coreAccountServiceMock.computeFederation).toBeCalledWith(
        {
          spId: sessionDataMock.spId,
          subSp: 'computedSubSp',
          hashSp: 'spIdentityHash',
        },
        {
          idpId: sessionDataMock.idpId,
          subIdp: 'computedSubIdp',
        },
      );
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

    it('Should call compute Sub for Sp based on identity hash', async () => {
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

    it('Should throw an error if computeFederation failed', async () => {
      // Given
      const errorMock = new Error('my error');
      coreAccountServiceMock.computeFederation.mockRejectedValueOnce(errorMock);

      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
    });

    it('Should patch the session with idp and sp identity', async () => {
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

    it('Should throw if identity storage for service provider fails', async () => {
      // Given
      const errorMock = new Error('my error');
      sessionServiceMock.set.mockRejectedValueOnce(errorMock);

      // Then
      await expect(service.handle(handleArgument)).rejects.toThrow(errorMock);
    });
  });
});
