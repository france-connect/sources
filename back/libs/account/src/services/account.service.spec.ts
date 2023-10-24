import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';

import { AccountNotFoundException } from '../exceptions';
import { IInteraction } from '../interfaces';
import { Account } from '../schemas';
import { AccountService } from './account.service';

describe('AccountService', () => {
  let service: AccountService;

  const loggerMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  };

  const accountModel = getModelToken('Account');

  const constructorSpy = jest.fn();

  const findOneSpy = jest.fn();
  const findOneAndUpdateSpy = jest.fn();

  class ModelClassMock {
    constructor(obj) {
      constructorSpy(obj);
      return obj;
    }

    // Actually async
    // eslint-disable-next-line require-await
    static async findOne(...args) {
      return findOneSpy(...args);
    }

    // Actually async
    // eslint-disable-next-line require-await
    static async findOneAndUpdate(...args) {
      return findOneAndUpdateSpy(...args);
    }
  }

  const modelMock = {
    save: jest.fn(),
    id: 'Account Mock Id Value',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        LoggerService,
        {
          provide: accountModel,
          useValue: ModelClassMock,
        },
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<AccountService>(AccountService);

    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('storeInteraction()', () => {
    // Given
    const identityHash = 'my identityHash';
    const interactionMock = { identityHash } as IInteraction;

    it('should call model save with result from buildInteraction', async () => {
      // Given
      service['getAccountWithInteraction'] = jest
        .fn()
        .mockResolvedValueOnce(modelMock);
      modelMock.save.mockResolvedValueOnce(undefined);

      // When
      await service.storeInteraction(interactionMock);

      // Then
      expect(service['getAccountWithInteraction']).toHaveBeenCalledTimes(1);
      expect(service['getAccountWithInteraction']).toHaveBeenCalledWith(
        interactionMock,
      );
      expect(modelMock.save).toHaveBeenCalledTimes(1);
    });

    it('should return account.id', async () => {
      // Given
      service['getAccountWithInteraction'] = jest
        .fn()
        .mockResolvedValueOnce(modelMock);

      // When
      const result = await service.storeInteraction(interactionMock);

      // Then
      expect(result).toBe(modelMock.id);
    });

    it("should throw if it can't retrieve the account", async () => {
      // Given
      service['getAccountWithInteraction'] = jest
        .fn()
        .mockRejectedValueOnce(new Error('test'));

      // Then
      await expect(service.storeInteraction(interactionMock)).rejects.toThrow();
    });

    it('should throw if model update fails', async () => {
      // Given
      service['getAccountWithInteraction'] = jest
        .fn()
        .mockResolvedValueOnce(modelMock);
      modelMock.save.mockRejectedValueOnce(new Error('test'));

      // Then
      await expect(service.storeInteraction(interactionMock)).rejects.toThrow();
    });
  });

  describe('getAccountWithInteraction()', () => {
    const identityHash = 'my identityHash mock';
    const id = 'mock-id';
    const newInteractionMock = {
      identityHash,
      spFederation: { sp1Id: 'sp1Sub' },
      lastConnection: new Date('2020-05-01'),
    } as IInteraction;

    it('should return an object with sp properties when no account is found', async () => {
      // Given
      findOneSpy.mockResolvedValueOnce(null);
      // When
      const result = await service['getAccountWithInteraction'](
        newInteractionMock,
      );
      // Then
      expect(constructorSpy).toHaveBeenCalledTimes(1);
      expect(constructorSpy).toHaveBeenCalledWith(newInteractionMock);
      expect(result).toEqual({
        identityHash,
        spFederation: { sp1Id: 'sp1Sub' },
        lastConnection: new Date('2020-05-01'),
      });
    });

    it('should return an object with sp informations when an account exists', async () => {
      // Given
      const databaseInteractionMock = {
        id,
        identityHash,
        spFederation: { sp2Id: 'sp2Sub' },
        lastConnection: new Date('2020-04-15'),
      };
      findOneSpy.mockResolvedValueOnce(databaseInteractionMock);
      // When
      const result = await service['getAccountWithInteraction'](
        newInteractionMock,
      );
      // Then
      expect(constructorSpy).toHaveBeenCalledTimes(0);
      expect(result).toEqual({
        id,
        identityHash,
        spFederation: {
          sp1Id: 'sp1Sub',
          sp2Id: 'sp2Sub',
        },
        lastConnection: new Date('2020-05-01'),
      });
    });
  });

  describe('isBlocked()', () => {
    const identityHash = 'my identityHash mock';
    it('should request with condition active = false', async () => {
      // When
      await service.isBlocked(identityHash);
      // Then
      expect(findOneSpy).toHaveBeenCalledTimes(1);
      expect(findOneSpy).toHaveBeenCalledWith({
        identityHash,
        active: false,
      });
    });

    it('should return false if no blocked record found', async () => {
      // Given
      findOneSpy.mockResolvedValueOnce(null);
      // When
      const result = await service.isBlocked(identityHash);
      // Then
      expect(result).toBe(false);
    });

    it('should return true if  blocked record found', async () => {
      // Given
      findOneSpy.mockResolvedValueOnce({});
      // When
      const result = await service.isBlocked(identityHash);
      // Then
      expect(result).toBe(true);
    });
  });

  describe('getAccountByIdentityHash()', () => {
    it('Should return an `Account` object from an `identityHash`', async () => {
      // Given
      const identityHashMock = 'identityHashMockValue';
      const accountMock: Account = {
        createdAt: new Date(),
        id: '0001',
        updatedAt: new Date(),
        lastConnection: new Date(),
        identityHash: identityHashMock,
        active: true,
        spFederation: {},
      } as Account;
      findOneSpy.mockResolvedValueOnce(accountMock);
      // When
      const account = service['getAccountByIdentityHash'](identityHashMock);
      // Then
      await expect(account).resolves.toBe(accountMock);
    });

    it('Should return an empty Account object if no account have been found.', async () => {
      // Given
      const identityHashMock = 'identityHashMockValue';
      const accountMock: Account = { id: null } as Account;
      findOneSpy.mockResolvedValueOnce(null);
      // When
      const account = service['getAccountByIdentityHash'](identityHashMock);
      // Then
      await expect(account).resolves.toEqual(accountMock);
    });
  });

  describe('updatePreferences', () => {
    const identityHashMock = 'identityHashMockValue';

    it('Should update `preferences` property of account and return the account before update', async () => {
      // Given
      const now = new Date();

      const accountMock: Account = {
        createdAt: now,
        id: '0001',
        updatedAt: now,
        lastConnection: now,
        identityHash: identityHashMock,
        active: true,
        spFederation: {},
        preferences: {
          idpSettings: {
            updatedAt: now,
            list: [],
            isExcludeList: false,
          },
        },
      } as Account;
      const idpList = ['foo', 'bar'];
      const accountBeforeUpdate = {
        id: accountMock.id,
        preferences: accountMock.preferences,
        updatedAt: expect.any(Date),
      };
      findOneAndUpdateSpy.mockResolvedValueOnce(accountMock);

      // When
      const result = await service.updatePreferences(
        identityHashMock,
        idpList,
        true,
      );

      // Then
      expect(result).toEqual(accountBeforeUpdate);
    });

    it('Should throw an AccountNotFoundException if account has not been found', async () => {
      // Given
      const idpListMock = ['foo', 'bar'];
      findOneAndUpdateSpy.mockResolvedValueOnce(null);
      // When/Then
      await expect(
        service.updatePreferences(identityHashMock, idpListMock, false),
      ).rejects.toThrow(AccountNotFoundException);
    });
  });
});
