import { lastValueFrom } from 'rxjs';
import { mocked } from 'ts-jest/utils';

import { HttpService } from '@nestjs/axios';
import { ValidationError } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { CheckTokenResponseDto } from '../dto';
import {
  CheckTokenFailedException,
  InvalidIdentityException,
  ReceivedInvalidScopeException,
} from '../exceptions';
import { DataProviderCoreAuthService } from './data-provider-core-auth.service';

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

jest.mock('rxjs');

describe('DataProviderCoreAuthService', () => {
  let service: DataProviderCoreAuthService;

  const validateDtoMock = mocked(validateDto);

  const lastValueFromMock = mocked(lastValueFrom);

  const checkTokenResponseMock = {
    scope: ['configuredScopeMockValue'],
    identity: {},
  } as CheckTokenResponseDto;

  const axiosResponseMock = {
    status: 200,
    data: checkTokenResponseMock,
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const configValueMock = {
    tokenEndpoint: 'tokenEndpointMockValue',
    scope: 'configuredScopeMockValue',
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
  };

  const httpServiceMock = {
    post: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataProviderCoreAuthService,
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
      .useValue(httpServiceMock)
      .compile();

    service = module.get<DataProviderCoreAuthService>(
      DataProviderCoreAuthService,
    );

    configServiceMock.get.mockReturnValue(configValueMock);

    validateDtoMock.mockResolvedValue([]);
    lastValueFromMock.mockResolvedValue(axiosResponseMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getIdentity', () => {
    // Given
    const tokenMock = 'tokenMockValue';
    const checkTokenMock = jest.fn();

    beforeEach(() => {
      service['checkToken'] = checkTokenMock;
      checkTokenMock.mockResolvedValue(checkTokenResponseMock);
    });

    it('should call checkToken() with token', async () => {
      // When
      await service.getIdentity(tokenMock);
      // Then
      expect(checkTokenMock).toHaveBeenCalledTimes(1);
      expect(checkTokenMock).toHaveBeenCalledWith(tokenMock);
    });

    it('should call validateDto with DTO and return from checkToken', async () => {
      // When
      await service.getIdentity(tokenMock);
      // Then
      expect(validateDtoMock).toHaveBeenCalledTimes(1);
      expect(validateDtoMock).toHaveBeenCalledWith(
        checkTokenResponseMock,
        CheckTokenResponseDto,
        expect.any(Object),
      );
    });

    it('should throw if DTO validation returns error', async () => {
      validateDtoMock.mockResolvedValueOnce([{} as ValidationError]);
      // Then
      await expect(service.getIdentity(tokenMock)).rejects.toThrow(
        InvalidIdentityException,
      );
    });

    it('should call configService.get() with lib name', async () => {
      // When
      await service.getIdentity(tokenMock);
      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith(
        'DataProviderCoreAuth',
      );
    });

    it('should throw if received scope does not match configured scope', async () => {
      // Given
      checkTokenMock.mockResolvedValueOnce({
        scope: ['invalidScopeReceivedMockValue'],
        identity: {},
      });
      // Then
      await expect(service.getIdentity(tokenMock)).rejects.toThrow(
        ReceivedInvalidScopeException,
      );
    });

    it('should return identity', async () => {
      // When
      const result = await service.getIdentity(tokenMock);
      // Then
      expect(result).toBe(checkTokenResponseMock.identity);
    });
  });

  describe('checkToken', () => {
    // Given
    const tokenMock = 'tokenMockValue';

    it('should call config with lib name', async () => {
      // When
      await service['checkToken'](tokenMock);
      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith(
        'DataProviderCoreAuth',
      );
    });

    it('should call http.post with endpoint and body', async () => {
      // When
      await service['checkToken'](tokenMock);
      // Then
      expect(httpServiceMock.post).toHaveBeenCalledTimes(1);
      expect(httpServiceMock.post).toHaveBeenCalledWith(
        configValueMock.tokenEndpoint,
        { token: tokenMock },
      );
    });

    it('should call lastValueFrom with return from http.post', async () => {
      // Given
      const httpServiceMockPostResponse = {};
      httpServiceMock.post.mockReturnValueOnce(httpServiceMockPostResponse);
      // When
      await service['checkToken'](tokenMock);
      // Then
      expect(lastValueFromMock).toHaveBeenCalledTimes(1);
      expect(lastValueFromMock).toHaveBeenCalledWith(
        httpServiceMockPostResponse,
      );
    });

    it('should throw if response.status is different than 200', async () => {
      // Given
      lastValueFromMock.mockResolvedValueOnce({ status: 500 });
      // Then
      await expect(service['checkToken'](tokenMock)).rejects.toThrow(
        CheckTokenFailedException,
      );
    });

    it('should throw if httpService throws', async () => {
      // Given
      httpServiceMock.post.mockImplementationOnce(() => {
        throw new Error();
      });
      // Then
      await expect(service['checkToken'](tokenMock)).rejects.toThrow(
        CheckTokenFailedException,
      );
    });

    it('should throw response.data is falsy', async () => {
      // Given
      lastValueFromMock.mockResolvedValueOnce({ status: 200 });
      // Then
      await expect(service['checkToken'](tokenMock)).rejects.toThrow(
        CheckTokenFailedException,
      );
    });

    it('should return response.data', async () => {
      // When
      const result = await service['checkToken'](tokenMock);
      // Then
      expect(result).toBe(axiosResponseMock.data);
    });
  });
});
