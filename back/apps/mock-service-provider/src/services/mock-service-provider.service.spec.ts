import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { MockServiceProviderService } from './mock-service-provider.service';

jest.mock('rxjs');

describe('MockServiceProviderService', () => {
  let service: MockServiceProviderService;

  const httpServiceMock = {
    get: jest.fn(),
  };

  const loggerServiceMock = getLoggerMock();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [MockServiceProviderService, HttpService, LoggerService],
    })
      .overrideProvider(HttpService)
      .useValue(httpServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<MockServiceProviderService>(
      MockServiceProviderService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getData', () => {
    const apiUrlMock = 'apiUrl';
    const accessTokenMock = 'accessToken';
    const authSecretMock = 'authSecret';
    const authorizationMock = `Bearer ${Buffer.from(
      `${accessTokenMock}:${authSecretMock}`,
      'utf-8',
    ).toString('base64')}`;

    const successResponseMock = {
      data: {
        message: 'OK',
      },
    };
    beforeEach(() => {
      jest.mocked(lastValueFrom).mockResolvedValue(successResponseMock);
    });

    it('should call the httpService with the authorization header containing the bearer', async () => {
      // When
      await service.getData(apiUrlMock, accessTokenMock, authSecretMock);

      // Then
      expect(httpServiceMock.get).toHaveBeenCalledTimes(1);
      expect(httpServiceMock.get).toHaveBeenCalledWith(apiUrlMock, {
        headers: {
          Authorization: authorizationMock,
        },
        proxy: false,
      });
    });

    it('should call lastValueFrom with the value returned by the httpServiceMock.get call', async () => {
      // Given
      const observableMock = 'observable';
      jest.mocked(httpServiceMock.get).mockReturnValue(observableMock);

      // When
      await service.getData(apiUrlMock, accessTokenMock, authSecretMock);

      // Then
      expect(lastValueFrom).toHaveBeenCalledTimes(1);
      expect(lastValueFrom).toHaveBeenCalledWith(observableMock);
    });

    it('should return the data from the response', async () => {
      // When
      const result = await service.getData(
        apiUrlMock,
        accessTokenMock,
        authSecretMock,
      );

      // Then
      expect(result).toStrictEqual(successResponseMock.data);
    });

    it('should throw an error if the httpServiceMock.get call fails', async () => {
      // Given
      const errorResponseMock = {
        response: {
          data: {
            error: 'error',
            // oidc compliant
            // eslint-disable-next-line @typescript-eslint/naming-convention
            error_description: 'error_description',
          },
        },
      };
      jest.mocked(lastValueFrom).mockRejectedValueOnce(errorResponseMock);

      // When / Then
      await expect(
        service.getData(apiUrlMock, accessTokenMock, authSecretMock),
      ).rejects.toStrictEqual(errorResponseMock.response.data);
    });
  });
});
