import { Response } from 'express';
import { JWK } from 'jose';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { DataProviderAdapterCoreService } from '@fc/data-provider-adapter-core';
import { JwkHelper } from '@fc/jwt';
import { LoggerService } from '@fc/logger';
import { DataParamsDto } from '@fc/mock-data-provider';

import { getLoggerMock } from '@mocks/logger';

import { MockDataProviderService } from '../services';
import { MockDataProviderController } from './mock-data-provider.controller';

jest.mock('@fc/jwt');

describe('MockDataProviderController', () => {
  let mockDataProviderController: MockDataProviderController;

  const loggerServiceMock = getLoggerMock();

  const resMock = {
    status: jest.fn(),
  } as unknown as Response;

  const dataProviderAdapterCoreServiceMock = {
    checktoken: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };
  const mockDataProviderServiceMock = {
    authenticateServiceProvider: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [MockDataProviderController],
      providers: [
        DataProviderAdapterCoreService,
        ConfigService,
        LoggerService,
        MockDataProviderService,
      ],
    })
      .overrideProvider(DataProviderAdapterCoreService)
      .useValue(dataProviderAdapterCoreServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(DataProviderAdapterCoreService)
      .useValue(dataProviderAdapterCoreServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(MockDataProviderService)
      .useValue(mockDataProviderServiceMock)
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
      data: { message: 'OK' },
    };

    const tokenMock = 'token_24';
    const secretMock = '42_secret';
    const authorizationHeaderMock = 'Bearer dG9rZW5fMjQ=';

    const bodyMock = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      auth_secret: secretMock,
    } as DataParamsDto;

    beforeEach(() => {
      dataProviderAdapterCoreServiceMock.checktoken.mockResolvedValue(
        checktokenResponseMock,
      );
    });

    it('should call authenticateServiceProvider with the secret from the body', async () => {
      // When
      await mockDataProviderController.data(
        resMock,
        bodyMock,
        authorizationHeaderMock,
      );

      // Then
      expect(
        mockDataProviderServiceMock.authenticateServiceProvider,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockDataProviderServiceMock.authenticateServiceProvider,
      ).toHaveBeenCalledWith(secretMock);
    });

    it('should use default empty string value for the access token if no authorization header is provided', async () => {
      // When
      await mockDataProviderController.data(resMock, bodyMock);

      // Then
      expect(
        mockDataProviderServiceMock.authenticateServiceProvider,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockDataProviderServiceMock.authenticateServiceProvider,
      ).toHaveBeenCalledWith(secretMock);
      expect(
        dataProviderAdapterCoreServiceMock.checktoken,
      ).toHaveBeenCalledTimes(1);
      expect(
        dataProviderAdapterCoreServiceMock.checktoken,
      ).toHaveBeenCalledWith('');
    });

    it('should call checktoken with the access token from the authorization header', async () => {
      // When
      await mockDataProviderController.data(
        resMock,
        bodyMock,
        authorizationHeaderMock,
      );

      // Then
      expect(
        dataProviderAdapterCoreServiceMock.checktoken,
      ).toHaveBeenCalledTimes(1);
      expect(
        dataProviderAdapterCoreServiceMock.checktoken,
      ).toHaveBeenCalledWith(tokenMock);
    });

    it('should set response status', async () => {
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
      await mockDataProviderController.data(
        resMock,
        bodyMock,
        authorizationHeaderMock,
      );

      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(
        checktokenErrorMock.httpStatusCode,
      );
    });

    it('should return data', async () => {
      // When
      const result = await mockDataProviderController.data(
        resMock,
        bodyMock,
        authorizationHeaderMock,
      );

      // Then
      expect(result).toStrictEqual(checktokenResponseMock);
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
      const result = await mockDataProviderController.data(
        resMock,
        bodyMock,
        authorizationHeaderMock,
      );

      // Then
      expect(result).toStrictEqual({
        error: checktokenErrorMock.error,
        error_description: checktokenErrorMock.message,
      });
    });
  });

  describe('jwks', () => {
    it('should return some status object', async () => {
      // Given
      configServiceMock.get.mockReturnValueOnce({
        jwks: { keys: ['foo', 'bar'] },
      });

      jest
        .mocked(JwkHelper.publicFromPrivate)
        .mockResolvedValueOnce('A' as unknown as JWK)
        .mockResolvedValueOnce('B' as unknown as JWK);

      // When
      const result = await mockDataProviderController.jwks();

      // Then
      expect(result).toStrictEqual({ keys: ['A', 'B'] });
    });
  });
});
