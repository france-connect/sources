import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { CsmrFraudService } from '../services/csmr-fraud.service';
import { CsmrFraudController } from './csmr-fraud.controller';

describe('CsmrFraudController', () => {
  let controller: CsmrFraudController;

  const loggerMock = getLoggerMock();

  const fraudServiceMock = {
    getHello: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CsmrFraudController],
      providers: [CsmrFraudService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CsmrFraudService)
      .useValue(fraudServiceMock)
      .compile();

    controller = app.get<CsmrFraudController>(CsmrFraudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHello', () => {
    it('should call fraudService.getHello', () => {
      // When
      controller.getHello();
      // Then
      expect(fraudServiceMock.getHello).toHaveBeenCalledTimes(1);
    });
  });
});
