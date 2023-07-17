import { Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { DataProviderAdapterMongoService } from '@fc/data-provider-adapter-mongo';
import { DataProviderInvalidCredentialsException } from '@fc/data-provider-adapter-mongo/exceptions';
import { LoggerService } from '@fc/logger-legacy';

import { ChecktokenRequestDto } from '../dto';
import { InvalidChecktokenRequestException } from '../exceptions';
import { DataProviderService } from '../services';
import { DataProviderController } from './data-provider.controller';

describe('DataProviderController', () => {
  let dataProviderController: DataProviderController;

  const dataProviderServiceMock = {
    checkRequestValid: jest.fn(),
  };

  const dataProviderAdapterMongoMock = {
    checkAuthentication: jest.fn(),
  };

  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
  } as unknown as LoggerService;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataProviderController],
      providers: [
        DataProviderAdapterMongoService,
        DataProviderService,
        LoggerService,
      ],
    })
      .overrideProvider(DataProviderAdapterMongoService)
      .useValue(dataProviderAdapterMongoMock)
      .overrideProvider(DataProviderService)
      .useValue(dataProviderServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    dataProviderController = module.get<DataProviderController>(
      DataProviderController,
    );
    dataProviderServiceMock.checkRequestValid.mockReturnValue(true);
    dataProviderAdapterMongoMock.checkAuthentication.mockReturnValue(true);
  });

  it('should be defined', () => {
    expect(dataProviderController).toBeDefined();
  });

  describe('checktoken', () => {
    const resMock = {
      status: jest.fn(),
      end: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    beforeEach(() => {
      jest.mocked(resMock.status).mockReturnValue(resMock);
    });

    it('should return HTTP code 200 and call end function', async () => {
      // Given
      dataProviderServiceMock.checkRequestValid.mockReturnValue(true);
      dataProviderAdapterMongoMock.checkAuthentication.mockResolvedValue(
        Promise.resolve(),
      );
      const bodyMock: ChecktokenRequestDto = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        access_token: 'acces_token',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: 'client_id',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_secret: 'client_secret',
      };
      // When
      await dataProviderController.checktoken(resMock, bodyMock);
      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.end).toHaveBeenCalledTimes(1);
    });

    it('should return HTTP code 401 and send error message when checkAuthentication method failed', async () => {
      dataProviderServiceMock.checkRequestValid.mockReturnValue(true);
      // Given
      const bodyMock: ChecktokenRequestDto = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        access_token: 'acces_token',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: 'client_id',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_secret: 'client_secret',
      };
      dataProviderAdapterMongoMock.checkAuthentication.mockRejectedValue(
        new DataProviderInvalidCredentialsException(),
      );
      // When
      await dataProviderController.checktoken(resMock, bodyMock);
      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(resMock.json).toHaveBeenCalledTimes(1);
      expect(resMock.json).toHaveBeenCalledWith({
        error: 'invalid_client',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: 'Client authentication failed.',
      });
    });

    it('should return HTTP code 400 and send error message when checkRequest method failed', async () => {
      // Given
      dataProviderAdapterMongoMock.checkAuthentication.mockReturnValue(true);
      dataProviderServiceMock.checkRequestValid.mockRejectedValue(
        new InvalidChecktokenRequestException(),
      );
      const bodyMock: ChecktokenRequestDto = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        access_token: 'acces_token',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: 'client_id',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_secret: 'client_secret',
      };
      // When
      await dataProviderController.checktoken(resMock, bodyMock);
      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(400);
      expect(resMock.json).toHaveBeenCalledTimes(1);
      expect(resMock.json).toHaveBeenCalledWith({
        error: 'invalid_request',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: 'Required parameter missing or invalid.',
      });
    });
  });
});
