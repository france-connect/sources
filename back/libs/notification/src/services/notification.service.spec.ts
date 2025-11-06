import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { MongooseChangeStreamService } from '@fc/mongoose-change-stream';

import { NotificationInterface } from '../interfaces';
import { Notification } from '../schemas';
import { NotificationService } from './notification.service';

const repositoryMock = {
  find: jest.fn(),
  lean: jest.fn(),
  watch: jest.fn(),
  sort: jest.fn(),
};

const notificationModelToken = getModelToken(Notification.name);

describe('NotificationService', () => {
  let service: NotificationService;

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

  const changeStreamServiceMock = {
    registerWatcher: jest.fn(),
  };

  const notValidNotificationMock = ['bad data'];

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: notificationModelToken,
          useValue: repositoryMock,
        },
        MongooseChangeStreamService,
      ],
    })
      .overrideProvider(MongooseChangeStreamService)
      .useValue(changeStreamServiceMock)
      .compile();

    service = module.get<NotificationService>(NotificationService);

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

    it('should call registerWatcher method', async () => {
      // When
      await service.onModuleInit();
      // Then
      expect(
        changeStreamServiceMock.registerWatcher,
      ).toHaveBeenCalledExactlyOnceWith(repositoryMock, expect.any(Function));
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
      service['findActiveNotification'] = jest
        .fn()
        .mockResolvedValueOnce(notificationMock);
      const expected = notificationMock;
      // When
      const result = await service.getList();
      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should call findActiveNotification if refresh cache flag is true', async () => {
      service['findActiveNotification'] = jest
        .fn()
        .mockResolvedValueOnce(notificationMock);
      const refreshCache = true;
      // When
      await service.getList(refreshCache);
      // Then
      expect(service['findActiveNotification']).toHaveBeenCalledTimes(1);
    });

    it('should not call findActiveNotification if refresh cache flag is not set and cache property is already set', async () => {
      service['findActiveNotification'] = jest
        .fn()
        .mockResolvedValueOnce(notificationMock);
      service['listCache'] = Symbol(
        'list cache',
      ) as unknown as NotificationInterface[];
      // When
      await service.getList();
      // Then
      expect(service['findActiveNotification']).not.toHaveBeenCalled();
    });

    it('should return cache property if refresh cache flag is not set and cache property is already set', async () => {
      service['findActiveNotification'] = jest
        .fn()
        .mockResolvedValueOnce(notificationMock);
      service['listCache'] = Symbol(
        'list cache',
      ) as unknown as NotificationInterface[];
      // When
      const result = await service.getList();
      // Then
      expect(result).toBe(service['listCache']);
    });
  });

  describe('findActiveNotification', () => {
    repositoryMock.find.mockReturnValueOnce(findMock);

    it('should return notification with valid data', async () => {
      repositoryMock.lean = jest
        .fn()
        .mockResolvedValueOnce(validNotificationMock);
      // When
      const result = await service['findActiveNotification']();
      // Then
      expect(repositoryMock.find).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(notificationMock);
    });

    it("shouldn't return notification with valid data", async () => {
      repositoryMock.lean = jest
        .fn()
        .mockResolvedValueOnce(notValidNotificationMock);
      // When
      const result = await service['findActiveNotification']();
      // Then
      expect(repositoryMock.find).toHaveBeenCalledTimes(1);
      expect(result).not.toStrictEqual(notificationMock);
    });

    it('should return emptyNotification', async () => {
      repositoryMock.lean = jest.fn().mockResolvedValueOnce([]);
      // When
      const result = await service['findActiveNotification']();
      // Then
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
