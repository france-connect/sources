import { Test, TestingModule } from '@nestjs/testing';

import { DataProviderCoreAuthService } from '@fc/data-provider-core-auth';
import { LoggerService } from '@fc/logger';
import { TracksService } from '@fc/tracks';

import { TracksDataProviderController } from './tracks-data-provider.controller';

describe('TracksDataProviderController', () => {
  let controller: TracksDataProviderController;

  const loggerMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
    debug: jest.fn(),
  };

  const coreAuthMock = {
    getIdentity: jest.fn(),
  };

  const tracksMock = {
    getList: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TracksDataProviderController],
      providers: [LoggerService, DataProviderCoreAuthService, TracksService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(DataProviderCoreAuthService)
      .useValue(coreAuthMock)
      .overrideProvider(TracksService)
      .useValue(tracksMock)
      .compile();

    controller = app.get<TracksDataProviderController>(
      TracksDataProviderController,
    );
  });

  describe('getTracks', () => {
    it('should call coreAuth.getIdentity with token', async () => {
      // Given
      const tokenMock = 'tokenMockValue';
      // When
      await controller.getTracks(tokenMock);
      // Then
      expect(coreAuthMock.getIdentity).toHaveBeenCalledTimes(1);
      expect(coreAuthMock.getIdentity).toHaveBeenCalledWith(tokenMock);
    });
  });
});
