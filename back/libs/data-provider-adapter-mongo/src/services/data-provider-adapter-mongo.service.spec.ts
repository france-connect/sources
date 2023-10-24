import { EventBus } from '@nestjs/cqrs';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger-legacy';
import { MongooseCollectionOperationWatcherHelper } from '@fc/mongoose';

import {
  DataProviderInvalidCredentialsException,
  DataProviderNotFoundException,
} from '../exceptions';
import { DataProviderMetadata } from '../interfaces';
import { DataProviderAdapterMongoService } from './data-provider-adapter-mongo.service';

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

describe('DataProviderAdapterMongoService', () => {
  let service: DataProviderAdapterMongoService;

  const dataProviderMock = {
    uid: '6f21b751-ed06-48b6-a59c-36e1300a368a',
    title: 'Fournisseur de données Mock - 1',
    active: true,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_id:
      '423dcbdc5a15ece61ed00ff5989d72379c26d9ed4c8e4e05a87cffae019586e0',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_secret:
      'jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE',
  };

  const invalidDataProviderMock = {
    ...dataProviderMock,
    active: 'NOT_A_BOOLEAN',
  };

  const dataProviderListMock = [dataProviderMock];

  const loggerMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
    warn: jest.fn(),
  };

  const cryptographyMock = {
    decryptSymetric: jest.fn(),
  };

  const configMock = {
    get: jest.fn(),
  };

  const repositoryMock = {
    lean: jest.fn(),
    find: jest.fn(),
    watch: jest.fn(),
  };

  const eventBusMock = {
    publish: jest.fn(),
  };

  const mongooseCollectionOperationWatcherHelperMock = {
    connectAllWatchers: jest.fn(),
    watchWith: jest.fn(),
    watch: jest.fn(),
    operationTypeWatcher: jest.fn(),
  };

  const appConfigMock = {
    configuration: { clientSecretEncryptKey: 'clientSecretEncryptKeyMock' },
  };

  const dataProviderModel = getModelToken('DataProvider');

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptographyService,
        DataProviderAdapterMongoService,
        {
          provide: dataProviderModel,
          useValue: repositoryMock,
        },
        LoggerService,
        EventBus,
        ConfigService,
        MongooseCollectionOperationWatcherHelper,
      ],
    })
      .overrideProvider(CryptographyService)
      .useValue(cryptographyMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(EventBus)
      .useValue(eventBusMock)
      .overrideProvider(MongooseCollectionOperationWatcherHelper)
      .useValue(mongooseCollectionOperationWatcherHelperMock)
      .compile();

    service = module.get<DataProviderAdapterMongoService>(
      DataProviderAdapterMongoService,
    );

    configMock.get.mockReturnValue(appConfigMock);
    repositoryMock.lean.mockResolvedValueOnce(dataProviderListMock);
    repositoryMock.find.mockReturnValueOnce(repositoryMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    beforeEach(() => {
      // Given
      service['getList'] = jest.fn();
    });

    it('should call getList', async () => {
      // When
      await service.onModuleInit();
      // Then
      expect(service['getList']).toHaveBeenCalledTimes(1);
      expect(service['getList']).toHaveBeenCalledWith();
    });

    it('should call watchWith from mongooseHelper', async () => {
      // When
      await service.onModuleInit();
      // Then
      expect(
        mongooseCollectionOperationWatcherHelperMock.watchWith,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('refreshCache', () => {
    it('should call getList method with true value in param', async () => {
      // Given
      service.getList = jest.fn();
      // When
      await service.refreshCache();
      // Then
      expect(service.getList).toHaveBeenCalledTimes(1);
      expect(service.getList).toHaveBeenCalledWith(true);
    });
  });

  describe('findAllDataProvider', () => {
    let validateDtoMock;
    beforeEach(() => {
      validateDtoMock = jest.mocked(validateDto);
    });

    it('should have called find once', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([]);

      // When
      await service['findAllDataProvider']();

      // Then
      expect(repositoryMock.find).toHaveBeenCalledTimes(1);
    });

    it('should return result of type list', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([]);

      // When
      const result = await service['findAllDataProvider']();

      // Then
      expect(result).toEqual([dataProviderMock]);
    });

    it('should log a warning if an entry is excluded by the DTO', async () => {
      // Given
      const invalidDataProviderListMock = [
        dataProviderMock,
        invalidDataProviderMock,
      ];
      validateDtoMock
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(['there is an error']);

      repositoryMock.lean = jest
        .fn()
        .mockResolvedValueOnce(invalidDataProviderListMock);

      // When
      await service['findAllDataProvider']();

      // Then
      expect(loggerMock.warn).toHaveBeenCalledTimes(1);
    });

    it('should filter out any entry exluded by the DTO', async () => {
      // Given
      const invalidDataProviderListMock = [
        dataProviderMock,
        invalidDataProviderMock,
      ];
      validateDtoMock
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(['there is an error']);

      repositoryMock.lean = jest
        .fn()
        .mockResolvedValueOnce(invalidDataProviderListMock);

      // When
      const result = await service['findAllDataProvider']();

      // Then
      expect(result).toEqual(dataProviderListMock);
    });
  });

  describe('getList', () => {
    let validateDtoMock;
    beforeEach(() => {
      validateDtoMock = jest.mocked(validateDto);
      service['findAllIdentityProvider'] = jest
        .fn()
        .mockResolvedValueOnce(dataProviderListMock);
    });

    it('should return a list of valides data providers', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce(dataProviderMock);
      service['decryptClientSecret'] = jest
        .fn()
        .mockReturnValueOnce(dataProviderMock.client_secret);
      service['findAllDataProvider'] = jest
        .fn()
        .mockReturnValueOnce(dataProviderListMock);

      // When
      const result = await service.getList();

      // Then
      expect(result).toEqual(dataProviderListMock);
    });

    it('should call findAll method if refreshCache is true', async () => {
      // Given
      const refresh = true;
      const listMock = [
        {
          // oidc param name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_id: 'foo',
        },
        {
          // oidc param name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_id: 'bar',
        },
      ];
      validateDtoMock.mockResolvedValueOnce(dataProviderMock);
      service['decryptClientSecret'] = jest
        .fn()
        .mockReturnValueOnce(dataProviderMock.client_secret);
      service['findAllDataProvider'] = jest.fn().mockResolvedValue(listMock);
      // When
      const result = await service.getList(refresh);
      // Then
      expect(service['findAllDataProvider']).toHaveBeenCalledTimes(1);
      expect(service['findAllDataProvider']).toHaveBeenCalledWith();
      expect(result).toEqual(listMock);
    });

    it('should not call findAll method if refreshCache is not set and cache exists', async () => {
      // Given
      service['listCache'] = [
        {
          // oidc param name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_id: 'foo',
        } as DataProviderMetadata,
        {
          // oidc param name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_id: 'bar',
        } as DataProviderMetadata,
      ];
      service['findAllDataProvider'] = jest.fn();
      // When
      const result = await service.getList();
      // Then
      expect(result).toBe(service['listCache']);
      expect(service['findAllDataProvider']).toHaveBeenCalledTimes(0);
    });
  });

  describe('decryptClientSecret', () => {
    it('should get clientSecretEncryptKey from config', () => {
      // Given
      const clientSecretMock = 'some string';
      const clientSecretEncryptKey = 'Key';
      configMock.get.mockReturnValueOnce({
        clientSecretEncryptKey,
      });

      // When
      service['decryptClientSecret'](clientSecretMock);

      // Then
      expect(configMock.get).toHaveBeenCalledTimes(1);
    });

    it('should call decrypt with encrypt key from config', () => {
      // Given
      const clientSecretMock = 'some string';
      const clientSecretEncryptKey = 'Key';
      configMock.get.mockReturnValue({
        clientSecretEncryptKey,
      });
      cryptographyMock.decryptSymetric.mockReturnValue('totoIsDecrypted');
      // When
      service['decryptClientSecret'](clientSecretMock);
      // Then
      expect(cryptographyMock.decryptSymetric).toHaveBeenCalledTimes(1);
      expect(cryptographyMock.decryptSymetric).toHaveBeenCalledWith(
        clientSecretEncryptKey,
        clientSecretMock,
      );
    });

    it('should return clientSecretEncryptKey', () => {
      // Given
      const clientSecretMock = 'some string';
      const clientSecretEncryptKey = 'Key';
      configMock.get.mockReturnValue({
        clientSecretEncryptKey,
      });
      cryptographyMock.decryptSymetric.mockReturnValue('totoIsDecrypted');

      // When
      const result = service['decryptClientSecret'](clientSecretMock);
      // Then
      expect(result).toEqual('totoIsDecrypted');
    });
  });

  describe('getById', () => {
    // Given
    const dpListMock = [{ uid: 'uid_1' }, { uid: 'uid_2' }];

    it('should return an existing data provider', async () => {
      // Given
      const idMock = 'uid_2';
      service.getList = jest.fn().mockResolvedValueOnce(dpListMock);
      // When
      const result = await service.getById(idMock);
      // Then
      expect(result).toEqual({ uid: 'uid_2' });
    });

    it('should return undefined for non existing data provider', async () => {
      // Given
      const idMock = 'nope';
      service.getList = jest.fn().mockResolvedValueOnce(dpListMock);
      // When
      const result = await service.getById(idMock);
      // Then
      expect(result).toBeUndefined();
    });

    it('should pass refresh flag to getList method', async () => {
      // Given
      const idMock = 'uid_1';
      const refresh = true;
      service.getList = jest.fn().mockResolvedValueOnce(dpListMock);
      // When
      await service.getById(idMock, refresh);
      // Then
      expect(service.getList).toHaveBeenCalledTimes(1);
      expect(service.getList).toHaveBeenCalledWith(refresh);
    });
  });

  describe('getByCLientId', () => {
    // Given
    const dpListMock = [
      // eslint-disable-next-line @typescript-eslint/naming-convention
      { client_id: 'client_id_1' },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      { client_id: 'client_id_2' },
    ];

    it('should return an existing data provider', async () => {
      // Given
      const idMock = 'client_id_2';
      service.getList = jest.fn().mockResolvedValueOnce(dpListMock);
      // When
      const result = await service.getByClientId(idMock);
      // Then
      // eslint-disable-next-line @typescript-eslint/naming-convention
      expect(result).toEqual({ client_id: 'client_id_2' });
    });

    it('should return undefined for non existing data provider', async () => {
      // Given
      const idMock = 'nope';
      service.getList = jest.fn().mockResolvedValueOnce(dpListMock);
      // When
      const result = await service.getByClientId(idMock);
      // Then
      expect(result).toBeUndefined();
    });

    it('should pass refresh flag to getList method', async () => {
      // Given
      const idMock = 'client_id_1';
      const refresh = true;
      service.getList = jest.fn().mockResolvedValueOnce(dpListMock);
      // When
      await service.getByClientId(idMock, refresh);
      // Then
      expect(service.getList).toHaveBeenCalledTimes(1);
      expect(service.getList).toHaveBeenCalledWith(refresh);
    });
  });

  describe('checkAuthentication', () => {
    it('should not throw error when client_id and client_secret are same as data provider', async () => {
      // Given
      const dpMock =
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { client_id: 'client_id_1', client_secret: 'client_secret_1' };
      const clientId = 'client_id_1';
      const clientSecret = 'client_secret_1';
      service['getByClientId'] = jest.fn().mockReturnValue(dpMock);
      // When / Then
      await expect(
        service.checkAuthentication(clientId, clientSecret),
      ).resolves.not.toThrow();
    });
    it('should throw an error when client_id and client_secret are differents of data provider', async () => {
      // Given
      const errorMock = new DataProviderInvalidCredentialsException();
      const dpMock =
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { client_id: 'foo', client_secret: 'bar' };
      const clientId = 'client_id_1';
      const clientSecret = 'client_secret_1';
      service['getByClientId'] = jest.fn().mockReturnValue(dpMock);
      // When
      const call = async () =>
        await service.checkAuthentication(clientId, clientSecret);

      // Then
      await expect(call).rejects.toThrow(errorMock);
    });

    it('should throw an error when no data provider found', async () => {
      // Given
      const errorMock = new DataProviderNotFoundException();
      const clientId = 'client_id_1';
      const clientSecret = 'client_secret_1';
      service['getByClientId'] = jest.fn().mockReturnValue(undefined);
      // When
      const call = async () =>
        await service.checkAuthentication(clientId, clientSecret);

      // Then
      await expect(call).rejects.toThrow(errorMock);
    });
  });
});
