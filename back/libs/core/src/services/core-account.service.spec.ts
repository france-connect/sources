import { Test, TestingModule } from '@nestjs/testing';

import { Account, AccountBlockedException, AccountService } from '@fc/account';
import {
  ComputeSp,
  CoreFailedPersistenceException,
  CoreIdpBlockedForAccountException,
} from '@fc/core';
import { LoggerService } from '@fc/logger-legacy';

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

  const entityIdMock = 'myEntityId';
  const subSpMock = 'MockedSpSub';
  const rnippidentityHashMock = 'rnippIdentityHashed';

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

  describe('buildFederation()', () => {
    it('should return an object containing the provider sub, having the entityId as key if it exist', () => {
      // Given
      const subSpMock = 'spMockedSub';

      // When
      const result = service['buildFederation'](entityIdMock, subSpMock);

      // Then
      expect(result).toEqual({ myEntityId: subSpMock });
    });
  });

  describe('computeFederation()', () => {
    const computeSp: ComputeSp = {
      key: entityIdMock,
      identityHash: rnippidentityHashMock,
      sub: subSpMock,
    };

    const federationMock = Symbol('federationMock');

    it('should call buildFederation to get spFederation', async () => {
      // Given
      service['buildFederation'] = jest.fn();
      accountServiceMock.storeInteraction.mockResolvedValue('saved');
      // When
      await service.computeFederation(computeSp);
      // Then
      expect(service['buildFederation']).toHaveBeenCalledTimes(1);
      expect(service['buildFederation']).toHaveBeenCalledWith(
        entityIdMock,
        subSpMock,
      );
    });

    it('should throw CoreFailedPersistenceException if persistence fails', async () => {
      // Given
      service['buildFederation'] = jest
        .fn()
        .mockReturnValueOnce(federationMock);
      accountServiceMock.storeInteraction.mockRejectedValueOnce('fail!!!');
      // Then
      await expect(service.computeFederation(computeSp)).rejects.toThrow(
        CoreFailedPersistenceException,
      );
    });

    it('should call storeInteraction with interaction object well formatted', async () => {
      // Given
      service['buildFederation'] = jest
        .fn()
        .mockReturnValueOnce(federationMock);
      // When
      await service.computeFederation(computeSp);

      // Then
      expect(accountServiceMock.storeInteraction).toHaveBeenCalledTimes(1);
      expect(accountServiceMock.storeInteraction).toHaveBeenCalledWith({
        identityHash: rnippidentityHashMock,
        lastConnection: expect.any(Date),
        spFederation: federationMock,
      });
    });

    it('should return accountId if all goes well', async () => {
      // Given
      service['buildFederation'] = jest
        .fn()
        .mockReturnValueOnce(federationMock);

      const accountIdMock = 'accountIdMockValue';

      accountServiceMock.storeInteraction.mockResolvedValueOnce(accountIdMock);
      // When
      const result = await service.computeFederation(computeSp);

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

  describe('checkIfIdpIsBlockedForAccount', () => {
    it('should throw an exception when the IDP is blocked', () => {
      // Given
      const accountMock = {
        preferences: {
          idpSettings: {
            isExcludeList: true,
            list: ['IDP-1'],
          },
        },
      } as unknown as Account; // Cela permet de ne pas devoir créer un accountMock contenant toutes les variables
      const idpMock = 'IDP-1';
      // When
      const call = () =>
        service.checkIfIdpIsBlockedForAccount(accountMock, idpMock);
      // Then
      expect(call).toThrow(CoreIdpBlockedForAccountException);
    });
    it('should not throw an exception if the IDP is not blocked', () => {
      // Given
      const accountMock = {
        preferences: {
          idpSettings: {},
        },
      } as unknown as Account; // Cela permet de ne pas devoir créer un accountMock contenant toutes les variables
      const idpMock = 'IDP-1';
      // When
      const call = () =>
        service.checkIfIdpIsBlockedForAccount(accountMock, idpMock);
      // Then
      expect(call).not.toThrow(CoreIdpBlockedForAccountException);
    });

    it('should not throw an exception if the account has no preferences', () => {
      // Given
      const accountMock = {} as unknown as Account; // Cela permet de ne pas devoir créer un accountMock contenant toutes les variables
      const idpMock = 'IDP-1';
      // When
      const call = () =>
        service.checkIfIdpIsBlockedForAccount(accountMock, idpMock);
      // Then
      expect(call).not.toThrow(CoreIdpBlockedForAccountException);
    });
  });
});
