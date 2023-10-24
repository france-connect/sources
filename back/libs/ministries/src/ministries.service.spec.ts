import { EventBus } from '@nestjs/cqrs';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';
import { MongooseCollectionOperationWatcherHelper } from '@fc/mongoose';

import { MinistriesService } from './ministries.service';

describe('MinistriesService', () => {
  let service: MinistriesService;

  const validMinistryMock1 = {
    _doc: {
      id: 'mock-ministry-uid-1',
      sort: 1,
      name: 'mock-ministry-name-1',
      identityProviders: [],
    },
  };

  const validMinistryMock2 = {
    _doc: {
      id: 'mock-ministry-uid-2',
      sort: 2,
      name: 'mock-ministry-name-2',
      identityProviders: [],
    },
  };

  const validMinistryMock3 = {
    _doc: {
      id: 'mock-ministry-uid-3',
      sort: 3,
      name: 'mock-ministry-name-3',
      identityProviders: [],
    },
  };

  const invalidMinistryMock = {
    _doc: {
      id: 'mock-ministry-uid-2-invalid',
      sort: 4,
      name: 'mock-ministry-name-2-invalid',
      identityProviders: 'NOT_AN_ARRAY',
    },
  };

  const ministriesListMock = [
    validMinistryMock2,
    validMinistryMock1,
    validMinistryMock3,
  ];

  const ministriesListSortedMock = [
    validMinistryMock1,
    validMinistryMock2,
    validMinistryMock3,
  ];

  const loggerMock = {
    setContext: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  const repositoryMock = {
    find: jest.fn(),
    exec: jest.fn(),
    watch: jest.fn(),
  };

  const eventBusMock = {
    publish: jest.fn(),
  };

  const mongooseCollectionOperationWatcherHelperMock = {
    connectAllWatchers: jest.fn(),
    watchWith: jest.fn(),
  };

  const ministriesModel = getModelToken('Ministries');

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MinistriesService,
        {
          provide: ministriesModel,
          useValue: repositoryMock,
        },
        LoggerService,
        EventBus,
        MongooseCollectionOperationWatcherHelper,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(EventBus)
      .useValue(eventBusMock)
      .overrideProvider(MongooseCollectionOperationWatcherHelper)
      .useValue(mongooseCollectionOperationWatcherHelperMock)

      .compile();

    service = module.get<MinistriesService>(MinistriesService);

    repositoryMock.find.mockReturnValueOnce(repositoryMock);
    repositoryMock.exec.mockResolvedValueOnce(ministriesListSortedMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
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
    beforeEach(() => {
      // Given
      service.getList = jest.fn();
    });

    it('should call getList method with true value in param', async () => {
      // When
      await service.refreshCache();
      // Then
      expect(service.getList).toHaveBeenCalledTimes(1);
      expect(service.getList).toHaveBeenCalledWith(true);
    });
  });

  describe('findAllMinistries', () => {
    it('should have called find once', async () => {
      // action
      await service['findAllMinistries']();
      // expect
      expect(repositoryMock.find).toHaveBeenCalledTimes(1);
    });

    it('should have called exec once', async () => {
      // action
      await service['findAllMinistries']();
      // expect
      expect(repositoryMock.exec).toHaveBeenCalledTimes(1);
    });

    it('should return a result of type list', async () => {
      // setup
      const expected = [
        validMinistryMock1._doc,
        validMinistryMock2._doc,
        validMinistryMock3._doc,
      ];
      // action
      const result = await service['findAllMinistries']();
      // expect
      expect(result).toStrictEqual(expected);
    });

    it('should log a warning if an entry is exluded by the DTO', async () => {
      // setup
      const listWithInvalidValuesMock = [
        validMinistryMock1,
        validMinistryMock3,
        validMinistryMock2,
        invalidMinistryMock,
      ];
      repositoryMock.exec = jest
        .fn()
        .mockResolvedValueOnce(listWithInvalidValuesMock);
      // action
      await service['findAllMinistries']();
      // expect
      expect(loggerMock.warn).toHaveBeenCalledTimes(1);
    });

    it('should filter out any entry exluded by the DTO', async () => {
      // setup
      const listWithInvalidValuesMock = [
        validMinistryMock1,
        validMinistryMock2,
        validMinistryMock3,
        invalidMinistryMock,
      ];
      const expected = [
        validMinistryMock1._doc,
        validMinistryMock2._doc,
        validMinistryMock3._doc,
      ];
      repositoryMock.exec = jest
        .fn()
        .mockResolvedValueOnce(listWithInvalidValuesMock);
      // action
      const result = await service['findAllMinistries']();
      // expect
      expect(result).toStrictEqual(expected);
    });
  });

  describe('getList', () => {
    beforeEach(() => {
      service['findAllMinistries'] = jest
        .fn()
        .mockResolvedValueOnce(ministriesListMock.map(({ _doc }) => _doc));
    });

    it('should return a list of valids ministries', async () => {
      // setup
      const expected = [
        validMinistryMock2._doc,
        validMinistryMock1._doc,
        validMinistryMock3._doc,
      ];
      const result = await service.getList();
      // expect
      expect(result).toStrictEqual(expected);
    });

    it('should call findAll method if refreshCache is true', async () => {
      // Given
      const listMockCached = [{ ...validMinistryMock1._doc }];
      const listMock = [
        { ...validMinistryMock1._doc, id: 'mock-cached-1' },
        { ...validMinistryMock2._doc, id: 'mock-cached-2' },
      ];
      service['listCache'] = listMockCached;
      service['findAllMinistries'] = jest.fn().mockResolvedValue(listMock);
      const refresh = true;
      // When
      const resultCached = await service.getList();
      const result = await service.getList(refresh);
      // Then
      expect(service['findAllMinistries']).toHaveBeenCalledTimes(1);
      expect(service['findAllMinistries']).toHaveBeenCalledWith();
      expect(resultCached).toStrictEqual(listMockCached);
      expect(result).toStrictEqual(listMock);
    });

    it('should not call findAll method if refreshCache is not set and cache exists', async () => {
      // Given
      service['listCache'] = [{ ...validMinistryMock1._doc }];
      service['findAllMinistries'] = jest.fn();
      // When
      const result = await service.getList();
      // Then
      expect(result).toBe(service['listCache']);
      expect(service['findAllMinistries']).toHaveBeenCalledTimes(0);
    });
  });
});
