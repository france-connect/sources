import { EventBus } from '@nestjs/cqrs';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

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
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(EventBus)
      .useValue(eventBusMock)
      .compile();

    service = module.get<MinistriesService>(MinistriesService);

    repositoryMock.find.mockReturnValueOnce(repositoryMock);
    repositoryMock.exec.mockResolvedValueOnce(ministriesListSortedMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call initOperationTypeWatcher', () => {
      // Given
      service['initOperationTypeWatcher'] = jest.fn();
      // When
      service.onModuleInit();
      // Then
      expect(service['initOperationTypeWatcher']).toHaveBeenCalledTimes(1);
    });
  });

  describe('initOperationTypeWatcher', () => {
    it('should call initOperationTypeWatcher', () => {
      // Given
      const streamMock = {
        driverChangeStream: { cursor: { on: jest.fn() } },
      };
      repositoryMock.watch = jest.fn().mockReturnValueOnce(streamMock);
      // When
      service['initOperationTypeWatcher']();
      // Then
      expect(repositoryMock.watch).toHaveBeenCalledTimes(1);
    });
  });

  describe('operationTypeWatcher', () => {
    // Given
    const operationTypes = {
      INSERT: 'insert',
      UPDATE: 'update',
      DELETE: 'delete',
      RENAME: 'rename',
      REPLACE: 'replace',
    };
    it('should call eventBus.publish() if DB stream.operationType = INSERT', () => {
      // Given
      const streamInsertMock = { operationType: operationTypes.INSERT };
      // When
      service['operationTypeWatcher'](streamInsertMock);
      // Then
      expect(service['eventBus'].publish).toHaveBeenCalledTimes(1);
    });

    it('should call eventBus.publish() if DB stream.operationType = UPDATE', () => {
      // Given
      const streamInsertMock = { operationType: operationTypes.UPDATE };
      // When
      service['operationTypeWatcher'](streamInsertMock);
      // Then
      expect(service['eventBus'].publish).toHaveBeenCalledTimes(1);
    });

    it('should call eventBus.publish() if DB stream.operationType = DELETE', () => {
      // Given
      const streamInsertMock = { operationType: operationTypes.DELETE };
      // When
      service['operationTypeWatcher'](streamInsertMock);
      // Then
      expect(service['eventBus'].publish).toHaveBeenCalledTimes(1);
    });

    it('should call eventBus.publish() if DB stream.operationType = RENAME', () => {
      // Given
      const streamInsertMock = { operationType: operationTypes.RENAME };
      // When
      service['operationTypeWatcher'](streamInsertMock);
      // Then
      expect(service['eventBus'].publish).toHaveBeenCalledTimes(1);
    });

    it('should call eventBus.publish() if DB stream.operationType = REPLACE', () => {
      // Given
      const streamInsertMock = { operationType: operationTypes.REPLACE };
      // When
      service['operationTypeWatcher'](streamInsertMock);
      // Then
      expect(service['eventBus'].publish).toHaveBeenCalledTimes(1);
    });

    it("shouldn't call eventBus.publish() if DB stream.operationType = null", () => {
      // Given
      const streamInsertMock = { operationType: null };
      // When
      service['operationTypeWatcher'](streamInsertMock);
      // Then
      expect(service['eventBus'].publish).toHaveBeenCalledTimes(0);
    });
  });

  describe('findAllMinistries', () => {
    it('should resolve', async () => {
      // action
      const result = service['findAllMinistries']();
      // expect
      expect(result).toBeInstanceOf(Promise);
    });

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

    it('should resolve', async () => {
      // action
      const result = service.getList();
      // expect
      expect(result).toBeInstanceOf(Promise);
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
