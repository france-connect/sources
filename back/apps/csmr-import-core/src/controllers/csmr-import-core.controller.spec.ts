import { Test, TestingModule } from '@nestjs/testing';

import { CsmrImportCoreMessageDto } from '@fc/csmr-import-core-client/protocol';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { CsmrImportCoreService } from '../services';
import { CsmrImportCoreController } from './csmr-import-core.controller';

describe('CsmrImportCoreController', () => {
  let controller: CsmrImportCoreController;

  const loggerServiceMock = getLoggerMock();

  const importCoreServiceMock = {
    validateAndCreateServiceProvider: jest.fn(),
  };

  const payloadMock = Symbol('payloadMock');
  const userMock = 'userMock';

  const messageMock = {
    payload: payloadMock,
    user: userMock,
  } as unknown as CsmrImportCoreMessageDto;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [CsmrImportCoreController],
      providers: [CsmrImportCoreService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(CsmrImportCoreService)
      .useValue(importCoreServiceMock)
      .compile();

    controller = app.get<CsmrImportCoreController>(CsmrImportCoreController);
    importCoreServiceMock.validateAndCreateServiceProvider.mockReturnValue(
      messageMock.payload,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('importServiceProvider', () => {
    it('should call importCoreServiceMock.checkServiceProviderExists with correct parameters', async () => {
      // When
      await controller.importServiceProvider(messageMock);

      // Then
      expect(
        importCoreServiceMock.validateAndCreateServiceProvider,
      ).toHaveBeenCalledExactlyOnceWith(messageMock.payload, messageMock.user);
    });

    it('should return object from validateAndCreateServiceProvider method', async () => {
      // When
      const result = await controller.importServiceProvider(messageMock);

      // Then
      expect(loggerServiceMock.debug).toHaveBeenCalledExactlyOnceWith({
        response: messageMock.payload,
      });
      expect(result).toEqual(messageMock.payload);
    });

    it('should log error and return "ERROR" if an error occurs', async () => {
      // Given
      const errorMock = new Error('test error');
      importCoreServiceMock.validateAndCreateServiceProvider.mockRejectedValueOnce(
        errorMock,
      );

      // When
      const result = await controller.importServiceProvider(messageMock);

      // Then
      expect(loggerServiceMock.err).toHaveBeenCalledWith({ error: errorMock });
      expect(result).toEqual('ERROR');
    });
  });
});
