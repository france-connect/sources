import { Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { DataProviderAdapterCoreService } from '@fc/data-provider-adapter-core';

import { MockDataProviderController } from './mock-data-provider.controller';

describe('MockDataProviderController', () => {
  let mockDataProviderController: MockDataProviderController;

  const resMock = {
    status: jest.fn(),
  } as unknown as Response;

  const dataProviderAdapterCoreServiceMock = {
    checktoken: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [MockDataProviderController],
      providers: [DataProviderAdapterCoreService],
    })
      .overrideProvider(DataProviderAdapterCoreService)
      .useValue(dataProviderAdapterCoreServiceMock)
      .compile();

    mockDataProviderController = app.get<MockDataProviderController>(
      MockDataProviderController,
    );
  });

  it('should be defined', () => {
    expect(mockDataProviderController).toBeDefined();
  });

  describe('data', () => {
    const checktokenResponseMock = {
      status: 200,
      data: { mock: 'data' },
    };

    beforeEach(() => {
      dataProviderAdapterCoreServiceMock.checktoken.mockResolvedValue(
        checktokenResponseMock,
      );
    });

    it('should call checktoken', async () => {
      // When
      await mockDataProviderController.data(resMock);

      // Then
      expect(
        dataProviderAdapterCoreServiceMock.checktoken,
      ).toHaveBeenCalledTimes(1);
      expect(
        dataProviderAdapterCoreServiceMock.checktoken,
      ).toHaveBeenCalledWith('unrevelent_mock_access_token');
    });

    it('should set response status', async () => {
      // When
      await mockDataProviderController.data(resMock);

      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(
        checktokenResponseMock.status,
      );
    });

    it('should return data', async () => {
      // When
      const result = await mockDataProviderController.data(resMock);

      // Then
      expect(result).toStrictEqual(checktokenResponseMock.data);
    });

    it('should return error if checktoken throws', async () => {
      // Given
      const checktokenErrorMock = {
        error: 'error',
        message: 'message',
        httpStatusCode: 400,
      };
      dataProviderAdapterCoreServiceMock.checktoken.mockRejectedValue(
        checktokenErrorMock,
      );

      // When
      const result = await mockDataProviderController.data(resMock);

      // Then
      expect(result).toStrictEqual({
        error: checktokenErrorMock.error,
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: checktokenErrorMock.message,
      });
    });
  });
});
