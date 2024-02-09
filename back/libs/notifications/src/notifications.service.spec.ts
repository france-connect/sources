import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { MongooseCollectionOperationWatcherHelper } from '@fc/mongoose';

import { NotificationInterface } from './interfaces';
import { NotificationsService } from './notifications.service';

const repositoryMock = {
  find: jest.fn(),
  lean: jest.fn(),
  watch: jest.fn(),
  sort: jest.fn(),
};

const serviceProviderModel = getModelToken('Notifications');

describe('NotificationsService', () => {
  let service: NotificationsService;

  const now = Date.now();

  const notificationMock = [
    {
      isActive: true,
      message: 'message mock',
      startDate: new Date(now - 3 * 1000), // 3 seconds ago
      stopDate: new Date(now + 60 * 1000), // in 1 minute
    },
  ];

  const findMock = {
    find: { exec: jest.fn() },
  };
  const validNotificationMock = [
    {
      isActive: true,
      message: 'message mock',
      startDate: new Date(now - 3 * 1000), // 3 seconds ago
      stopDate: new Date(now + 60 * 1000), // in 60 seconds
    },
  ];

  const validNotificationMock2 = [
    {
      isActive: true,
      message: 'message mock2',
      startDate: new Date(now - 2 * 1000), // 2 seconds ago
      stopDate: new Date(now + 60 * 1000), // in 60 seconds
    },
  ];

  const expiredValidNotificationMock = [
    {
      isActive: true,
      message: 'Invalid mock',
      startDate: new Date(now - 60 * 1000), // 60 seconds ago
      stopDate: new Date(now - 30 * 1000), // 30 seconds ago
    },
  ];

  const mongooseCollectionOperationWatcherHelperMock = {
    connectAllWatchers: jest.fn(),
    watchWith: jest.fn(),
    watch: jest.fn(),
    operationTypeWatcher: jest.fn(),
  };

  const notValidNotificationMock = ['bad data'];

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        {
          provide: serviceProviderModel,
          useValue: repositoryMock,
        },
        MongooseCollectionOperationWatcherHelper,
      ],
    })
      .overrideProvider(MongooseCollectionOperationWatcherHelper)
      .useValue(mongooseCollectionOperationWatcherHelperMock)
      .compile();

    service = module.get<NotificationsService>(NotificationsService);

    repositoryMock.find.mockReturnValueOnce(repositoryMock);
    repositoryMock.lean.mockResolvedValueOnce(notificationMock);
    repositoryMock.sort.mockReturnValueOnce(repositoryMock);
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

  describe('getList', () => {
    it('should return notification', async () => {
      service['findActiveNotifications'] = jest
        .fn()
        .mockResolvedValueOnce(notificationMock);
      const expected = notificationMock;
      // action
      const result = await service.getList();
      // expect
      expect(result).toStrictEqual(expected);
    });

    it('should call findActiveNotifications if refresh cache flag is true', async () => {
      service['findActiveNotifications'] = jest
        .fn()
        .mockResolvedValueOnce(notificationMock);
      const refreshCache = true;
      // action
      await service.getList(refreshCache);
      // expect
      expect(service['findActiveNotifications']).toHaveBeenCalledTimes(1);
    });

    it('should not call findActiveNotifications if refresh cache flag is not set and cache property is already set', async () => {
      service['findActiveNotifications'] = jest
        .fn()
        .mockResolvedValueOnce(notificationMock);
      service['listCache'] = Symbol(
        'list cache',
      ) as unknown as NotificationInterface[];
      // action
      await service.getList();
      // expect
      expect(service['findActiveNotifications']).not.toHaveBeenCalled();
    });

    it('should return cache property if refresh cache flag is not set and cache property is already set', async () => {
      service['findActiveNotifications'] = jest
        .fn()
        .mockResolvedValueOnce(notificationMock);
      service['listCache'] = Symbol(
        'list cache',
      ) as unknown as NotificationInterface[];
      // action
      const result = await service.getList();
      // expect
      expect(result).toBe(service['listCache']);
    });
  });

  describe('findActiveNotifications', () => {
    repositoryMock.find.mockReturnValueOnce(findMock);

    it('should return notification with valid data', async () => {
      repositoryMock.lean = jest
        .fn()
        .mockResolvedValueOnce(validNotificationMock);
      // action
      const result = await service['findActiveNotifications']();
      // expect
      expect(repositoryMock.find).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(notificationMock);
    });

    it("shouldn't return notification with valid data", async () => {
      repositoryMock.lean = jest
        .fn()
        .mockResolvedValueOnce(notValidNotificationMock);
      // action
      const result = await service['findActiveNotifications']();
      // expect
      expect(repositoryMock.find).toHaveBeenCalledTimes(1);
      expect(result).not.toStrictEqual(notificationMock);
    });

    it('should return emptyNotification', async () => {
      repositoryMock.lean = jest.fn().mockResolvedValueOnce([]);
      // action
      const result = await service['findActiveNotifications']();
      // expect
      expect(repositoryMock.find).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual([]);
    });
  });

  describe('getNotificationToDisplay', () => {
    it('should return first notification matching condition if present in list', async () => {
      // Given
      service['getList'] = jest
        .fn()
        .mockResolvedValueOnce([
          expiredValidNotificationMock[0],
          validNotificationMock[0],
          validNotificationMock2[0],
        ]);
      // When
      const result = await service.getNotificationToDisplay();
      // Then
      expect(result).toBe(validNotificationMock[0]);
    });

    it('should return undefined if no notification are valid', async () => {
      // Given
      service['getList'] = jest
        .fn()
        .mockResolvedValueOnce([expiredValidNotificationMock[0]]);
      // When
      const result = await service.getNotificationToDisplay();
      // Then
      expect(result).toBe(undefined);
    });

    it('should return undefined if list is empty', async () => {
      // Given
      service['getList'] = jest.fn().mockResolvedValueOnce([]);
      // When
      const result = await service.getNotificationToDisplay();
      // Then
      expect(result).toBe(undefined);
    });
  });
});
