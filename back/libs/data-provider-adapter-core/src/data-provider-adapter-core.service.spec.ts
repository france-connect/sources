import { AxiosError } from 'axios';
import { mocked } from 'jest-mock';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { DataProviderAdapterCoreService } from './data-provider-adapter-core.service';
import {
  ChecktokenHttpStatusException,
  ChecktokenTimeoutException,
} from './exceptions';

jest.mock('rxjs');

describe('DataProviderAdapterCoreService', () => {
  let service: DataProviderAdapterCoreService;

  const configServiceMock = {
    get: jest.fn().mockReturnValue({}),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
  };

  const HttpServiceMock = {
    post: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataProviderAdapterCoreService,
        ConfigService,
        LoggerService,
        HttpService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(HttpService)
      .useValue(HttpServiceMock)
      .compile();

    service = module.get<DataProviderAdapterCoreService>(
      DataProviderAdapterCoreService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set logger context', () => {
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
    expect(loggerServiceMock.setContext).toHaveBeenCalledWith(
      DataProviderAdapterCoreService.name,
    );
  });

  describe('checktoken', () => {
    const configMock = {
      // Based on oidc standard
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: 'client_id',
      // Based on oidc standard
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_secret: 'client_secret',
      checktokenEndpoint: 'checktokenEndpoint',
    };
    const tokenMock = 'token';

    const responseMock = {
      status: 200,
      data: 'data',
    };

    beforeEach(() => {
      configServiceMock.get.mockReturnValue(configMock);

      mocked(lastValueFrom).mockResolvedValue(responseMock);
    });

    it('should retrieve the DataProviderAdapterCore configuration', async () => {
      // When
      await service.checktoken(tokenMock);

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith(
        'DataProviderAdapterCore',
      );
    });

    it('should call the checktoken endpoint with the configuration', async () => {
      // Given
      const expectedHeader = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      };
      const expectedUri =
        'client_id=client_id&client_secret=client_secret&access_token=token';

      // When
      await service.checktoken(tokenMock);

      // Then
      expect(HttpServiceMock.post).toHaveBeenCalledTimes(1);
      expect(HttpServiceMock.post).toHaveBeenCalledWith(
        configMock.checktokenEndpoint,
        expectedUri,
        expectedHeader,
      );
    });

    it('should return the response data', async () => {
      // When
      const result = await service.checktoken(tokenMock);

      // Then
      expect(result).toStrictEqual(responseMock);
    });

    it('should call checktokenHttpError if lastValueFrom throws', async () => {
      // Given
      const axiosErrorMock = {
        isAxiosError: true,
      } as AxiosError;
      const errorMock = new ChecktokenHttpStatusException('error');
      service['checktokenHttpError'] = jest.fn().mockImplementation(() => {
        throw errorMock;
      });
      mocked(lastValueFrom).mockRejectedValueOnce(axiosErrorMock);

      // When / Then
      await expect(service.checktoken(tokenMock)).rejects.toThrowError(
        errorMock,
      );
      expect(service['checktokenHttpError']).toHaveBeenCalledTimes(1);
      expect(service['checktokenHttpError']).toHaveBeenCalledWith(
        axiosErrorMock,
      );
    });
  });

  describe('checktokenHttpError', () => {
    it('should throw ChecktokenTimeoutException', () => {
      const error = {
        code: 'ETIMEDOUT',
      } as AxiosError;

      expect(() => service['checktokenHttpError'](error)).toThrowError(
        ChecktokenTimeoutException,
      );
    });

    it('should throw ChecktokenTimeoutException', () => {
      const error = {
        code: 'ECONNABORTED',
      } as AxiosError;

      expect(() => service['checktokenHttpError'](error)).toThrowError(
        ChecktokenTimeoutException,
      );
    });

    it('should throw ChecktokenTimeoutException', () => {
      const error = {
        code: 'ECONNRESET',
      } as AxiosError;

      expect(() => service['checktokenHttpError'](error)).toThrowError(
        ChecktokenTimeoutException,
      );
    });

    it('should throw ChecktokenHttpStatusException', () => {
      const error = {
        code: 'SOME_CODE',
      } as AxiosError;

      expect(() => service['checktokenHttpError'](error)).toThrowError(
        ChecktokenHttpStatusException,
      );
    });
  });
});
