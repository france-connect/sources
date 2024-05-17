import { v4 as uuid } from 'uuid';

import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { AccountFca } from '../schemas';
import { AccountFcaService } from './account-fca.service';

jest.mock('uuid');

describe('AccountFcaService', () => {
  let service: AccountFcaService;

  const loggerMock = getLoggerMock();

  const accountFcaModel = getModelToken('AccountFca');

  const constructorMock = jest.fn();

  const findOneMock = jest.fn();
  const findOneAndUpdateMock = jest.fn();

  class ModelClassMock {
    constructor(obj) {
      constructorMock(obj);
      return obj;
    }

    // Actually async
    // eslint-disable-next-line require-await
    static async findOne(...args) {
      return findOneMock(...args);
    }

    // Actually async
    // eslint-disable-next-line require-await
    static async findOneAndUpdate(...args) {
      return findOneAndUpdateMock(...args);
    }
  }

  const accountMock = {
    id: 'Account Mock Id Value',
    lastConnection: new Date('2023-04-25T21:44:02.968Z'),
  } as AccountFca;

  const modelMock = {
    ...accountMock,
    save: jest.fn(),
  };

  const interactionMock = {
    sub: 'Sub Value',
    lastConnection: new Date('2024-04-25T21:44:02.968Z'),
    idpSub: 'Idp Sub Value',
    idpUid: 'Idp Uid Value',
  };

  const idpIdentityKeyMock = {
    idpSub: interactionMock.idpSub,
    idpUid: interactionMock.idpUid,
  };

  const uuidMock = jest.mocked(uuid);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountFcaService,
        LoggerService,
        {
          provide: accountFcaModel,
          useValue: ModelClassMock,
        },
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<AccountFcaService>(AccountFcaService);

    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAccountByIdpAgentKeys()', () => {
    it('should call findOne with correct params', async () => {
      // Given
      findOneMock.mockResolvedValueOnce(modelMock);

      // When
      await service.getAccountByIdpAgentKeys(idpIdentityKeyMock);

      // Then
      expect(findOneMock).toHaveBeenCalledTimes(1);
      expect(findOneMock).toHaveBeenCalledWith({
        'idpIdentityKeys.idpUid': idpIdentityKeyMock.idpUid,
        'idpIdentityKeys.idpSub': idpIdentityKeyMock.idpSub,
      });
    });

    it('should return an account if findOne returns one', async () => {
      // Given
      findOneMock.mockResolvedValueOnce(modelMock);

      // When
      const result = await service.getAccountByIdpAgentKeys(idpIdentityKeyMock);

      // Then
      expect(result).toBe(modelMock);
    });
  });

  describe('createAccount()', () => {
    it('should return a new account with uuid', () => {
      // Given
      uuidMock.mockReturnValueOnce('custom-uuid');

      // When
      const result = service['createAccount']();

      // Then
      expect(result).toEqual({ sub: 'custom-uuid' });
    });
  });

  describe('upsertWithSub()', () => {
    it('should call findOneAndUpdate with correct params', async () => {
      // Given
      findOneAndUpdateMock.mockResolvedValueOnce(accountMock);

      // When
      await service.upsertWithSub(accountMock);

      // Then
      expect(findOneAndUpdateMock).toHaveBeenCalledTimes(1);
      expect(findOneAndUpdateMock).toHaveBeenCalledWith(
        { sub: accountMock.sub },
        accountMock,
        { upsert: true },
      );
    });
  });
});
