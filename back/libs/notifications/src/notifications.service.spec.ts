import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { NotificationsService } from './notifications.service';

const repositoryMock = {
  findOne: jest.fn(),
  exec: jest.fn(),
  watch: jest.fn(),
};

const serviceProviderModel = getModelToken('Notifications');

describe('NotificationsService', () => {
  let service: NotificationsService;

  const notificationMock = [
    {
      isActive: true,
      message: 'message mock',
    },
  ];

  const findOneMock = {
    findOne: { exec: jest.fn() },
  };
  const validNotificationMock = [
    {
      isActive: true,
      message: 'message mock',
    },
  ];

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
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);

    repositoryMock.findOne.mockReturnValueOnce(repositoryMock);
    repositoryMock.exec.mockResolvedValueOnce(notificationMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('getNotifications', () => {
    it('should return notification', async () => {
      service['findActiveNotifications'] = jest
        .fn()
        .mockResolvedValueOnce(notificationMock);
      const expected = notificationMock;
      // action
      const result = await service.getNotifications();
      // expect
      expect(result).toStrictEqual(expected);
    });
  });

  describe('findActiveNotifications', () => {
    repositoryMock.findOne.mockReturnValueOnce(findOneMock);

    it('should return notification with valid data', async () => {
      repositoryMock.exec = jest
        .fn()
        .mockResolvedValueOnce(validNotificationMock);
      // action
      const result = await service['findActiveNotifications']();
      // expect
      expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(notificationMock);
    });

    it("shouldn't return notification with valid data", async () => {
      repositoryMock.exec = jest
        .fn()
        .mockResolvedValueOnce(notValidNotificationMock);
      // action
      const result = await service['findActiveNotifications']();
      // expect
      expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(result).not.toStrictEqual(notificationMock);
    });

    it('should return emptyNotification', async () => {
      repositoryMock.exec = jest.fn().mockResolvedValueOnce([]);
      // action
      const result = await service['findActiveNotifications']();
      // expect
      expect(repositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual([]);
    });
  });
});
