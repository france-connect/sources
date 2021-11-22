import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { UserPreferencesFcpService } from '../services';
import { UserPreferencesFcpController } from './user-preferences-fcp.controller';

describe('UserPreferencesFcpController', () => {
  let userPreferencesFcpController: UserPreferencesFcpController;

  const loggerMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  };

  const userPreferencesFcpMock = {};

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserPreferencesFcpController],
      providers: [LoggerService, UserPreferencesFcpService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(UserPreferencesFcpService)
      .useValue(userPreferencesFcpMock)
      .compile();

    userPreferencesFcpController = app.get<UserPreferencesFcpController>(
      UserPreferencesFcpController,
    );
  });

  describe('UserPreferencesFcpController', () => {
    it('should get the controller defined', () => {
      expect(userPreferencesFcpController).toBeDefined();
      expect(loggerMock.setContext).toHaveBeenCalledTimes(1);
      expect(loggerMock.setContext).toHaveBeenCalledWith(
        'UserPreferencesFcpController',
      );
    });
  });
});
