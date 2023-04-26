import { Test, TestingModule } from '@nestjs/testing';

import { AccountBlockedException, AccountService } from '@fc/account';
import {
  ComputeIdp,
  ComputeSp,
  CoreFailedPersistenceException,
} from '@fc/core';
import { LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';

import { CoreAccountService } from './core-account.service';

describe('CoreAccountService', () => {
  let service: CoreAccountService;

  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
    warn: jest.fn(),
  };

  const accountServiceMock = {
    isBlocked: jest.fn(),
    storeInteraction: jest.fn(),
  };

  const spIdentityMock = {
    email: 'eteach@fqdn.ext',
    // oidc param
    // eslint-disable-next-line @typescript-eslint/naming-convention
    family_name: 'TEACH',
    // oidc param
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'Edward',
    sub: '42',
  };

  const idpIdentityMock = {
    sub: 'some idpSub',
  };

  const sessionDataMock: OidcSession = {
    idpAcr: 'eidas3',
    idpId: '42',
    idpIdentity: idpIdentityMock,
    idpName: 'my favorite Idp',
    idpLabel: 'my favorite Idp Title',
    spAcr: 'eidas3',
    spId: 'sp_id',
    spIdentity: spIdentityMock,
    spName: 'my great SP',
  };

  const entityIdMock = 'myEntityId';
  const subSpMock = 'MockedSpSub';
  const rnippidentityHashMock = 'rnippIdentityHashed';
  const subIdpMock = 'MockedIdpSub';

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreAccountService, LoggerService, AccountService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(AccountService)
      .useValue(accountServiceMock)
      .compile();

    service = module.get<CoreAccountService>(CoreAccountService);

    accountServiceMock.isBlocked.mockResolvedValue(false);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFederation()', () => {
    it('should return an object containing the provider sub, having the entityId as key if it exist', () => {
      // Given
      const subSpMock = 'spMockedSub';

      // When
      const result = service['getFederation'](
        sessionDataMock.spId,
        subSpMock,
        entityIdMock,
      );

      // Then
      expect(result).toEqual({ myEntityId: { sub: subSpMock } });
    });

    it('should return an object containing the provider sub, having the providerId as key if entityId does not exist', () => {
      // Given
      const subIdpMock = 'idpMockedSub';

      // When
      const result = service['getFederation'](
        sessionDataMock.idpId,
        subIdpMock,
      );

      // Then
      expect(result).toEqual({ [sessionDataMock.idpId]: { sub: subIdpMock } });
    });
  });

  describe('computeFederation()', () => {
    const computeSp: ComputeSp = {
      entityId: entityIdMock,
      hashSp: rnippidentityHashMock,
      spId: sessionDataMock.spId,
      subSp: subSpMock,
    };
    const computeIdp: ComputeIdp = {
      idpId: sessionDataMock.idpId,
      subIdp: subIdpMock,
    };

    it('should call getFederation to get spFederation', async () => {
      // Given
      service['getFederation'] = jest.fn();
      accountServiceMock.storeInteraction.mockResolvedValue('saved');
      // When
      await service.computeFederation(computeSp, computeIdp);
      // Then
      expect(service['getFederation']).toHaveBeenCalledTimes(2);
      expect(service['getFederation']).toHaveBeenNthCalledWith(
        1,
        sessionDataMock.spId,
        subSpMock,
        entityIdMock,
      );
    });

    it('should call getFederation to get idpFederation', async () => {
      // Given
      service['getFederation'] = jest.fn();
      accountServiceMock.storeInteraction.mockResolvedValue('saved');
      // When
      await service.computeFederation(computeSp, computeIdp);
      // Then
      expect(service['getFederation']).toHaveBeenCalledTimes(2);
      expect(service['getFederation']).toHaveBeenNthCalledWith(
        2,
        sessionDataMock.idpId,
        subIdpMock,
      );
    });

    it('should throw CoreFailedPersistenceException if persistence fails', async () => {
      // Given
      service['getFederation'] = jest
        .fn()
        .mockReturnValueOnce({ myEntityId: { sub: subSpMock } })
        .mockReturnValueOnce({ [sessionDataMock.idpId]: { sub: subIdpMock } });
      accountServiceMock.storeInteraction.mockRejectedValueOnce('fail!!!');
      // Then
      await expect(
        service.computeFederation(computeSp, computeIdp),
      ).rejects.toThrow(CoreFailedPersistenceException);
    });

    it('should call storeInteraction with interaction object well formatted', async () => {
      // Given
      service['getFederation'] = jest
        .fn()
        .mockReturnValueOnce({ myEntityId: { sub: subSpMock } })
        .mockReturnValueOnce({ [sessionDataMock.idpId]: { sub: subIdpMock } });
      // When
      await service.computeFederation(computeSp, computeIdp);

      // Then
      expect(accountServiceMock.storeInteraction).toHaveBeenCalledTimes(1);
      expect(accountServiceMock.storeInteraction).toHaveBeenCalledWith({
        identityHash: rnippidentityHashMock,
        idpFederation: { [sessionDataMock.idpId]: { sub: subIdpMock } },
        lastConnection: expect.any(Date),
        spFederation: { myEntityId: { sub: subSpMock } },
      });
    });

    it('should return accountId if all goes well', async () => {
      // Given
      service['getFederation'] = jest
        .fn()
        .mockReturnValueOnce({ myEntityId: { sub: subSpMock } })
        .mockReturnValueOnce({ [sessionDataMock.idpId]: { sub: subIdpMock } });

      const accountIdMock = 'accountIdMockValue';

      accountServiceMock.storeInteraction.mockResolvedValueOnce(accountIdMock);
      // When
      const result = await service.computeFederation(computeSp, computeIdp);

      // Then
      expect(result).toBe(accountIdMock);
    });
  });

  describe('checkIfAccountIsBlocked()', () => {
    it('Should go through check if account is not blocked', async () => {
      // Given
      const identityHash = 'hashedIdentity';
      // Then
      await service.checkIfAccountIsBlocked(identityHash);

      expect(accountServiceMock.isBlocked).toBeCalledTimes(1);
    });

    it('Should throw if account is blocked', async () => {
      // Given
      accountServiceMock.isBlocked.mockResolvedValue(true);
      const identityHash = 'hashedIdentity';
      // Then
      await expect(
        service.checkIfAccountIsBlocked(identityHash),
      ).rejects.toThrow(AccountBlockedException);

      expect(accountServiceMock.isBlocked).toBeCalledTimes(1);
    });

    it('Should throw if account blocked check fails', async () => {
      // Given
      const error = new Error('foo');
      accountServiceMock.isBlocked.mockRejectedValueOnce(error);
      const identityHash = 'hashedIdentity';
      // Then
      await expect(
        service.checkIfAccountIsBlocked(identityHash),
      ).rejects.toThrow(error);

      expect(accountServiceMock.isBlocked).toBeCalledTimes(1);
    });
  });
});
