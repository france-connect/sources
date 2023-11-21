import { AxiosError } from 'axios';
import { mocked } from 'jest-mock';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { JwtService } from '@fc/jwt';
import { LoggerService } from '@fc/logger-legacy';

import { getJwtServiceMock } from '@mocks/jwt';

import { DataProviderAdapterCoreService } from './data-provider-adapter-core.service';
import {
  ChecktokenHttpStatusException,
  ChecktokenInvalidAlgorithmException,
  ChecktokenInvalidEncodingException,
  ChecktokenTimeoutException,
  JwksFetchFailedException,
} from './exceptions';

jest.mock('rxjs');

describe('DataProviderAdapterCoreService', () => {
  let service: DataProviderAdapterCoreService;

  const configServiceMock = {
    get: jest.fn().mockReturnValue({}),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
  };

  const HttpServiceMock = {
    post: jest.fn(),
    get: jest.fn(),
  };

  const jwtServiceMock = getJwtServiceMock();

  const axiosErrorMock = {
    response: {
      data: {
        error: 'error',
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: 'error_description',
      },
    },
  } as AxiosError<{
    error: string;
    // oidc compliant
    // eslint-disable-next-line @typescript-eslint/naming-convention
    error_description: string;
  }>;

  const encryptAlgorithm = 'ECDH-ES';
  const encryptEncoding = 'A256GCM';

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataProviderAdapterCoreService,
        ConfigService,
        LoggerService,
        HttpService,
        JwtService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(HttpService)
      .useValue(HttpServiceMock)
      .overrideProvider(JwtService)
      .useValue(jwtServiceMock)
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
    const tokenMock = 'token';

    const claimsMock = {};

    const responseMock = {
      status: 200,
      data: 'data',
    };

    const configMock = {
      checktokenEncryptedResponseAlg: encryptAlgorithm,
      checktokenEncryptedResponseEnc: encryptEncoding,
    };

    beforeEach(() => {
      service['fetchToken'] = jest.fn().mockResolvedValue(responseMock);
      service['getDecryptedAndVerifiedToken'] = jest
        .fn()
        .mockResolvedValue(claimsMock);

      mocked(lastValueFrom).mockResolvedValue(responseMock);
      service['checkEncryptAlgorithm'] = jest.fn();
      service['checkEncryptEncoding'] = jest.fn();
      configServiceMock.get.mockReturnValue(configMock);
    });

    it('should call checktokenHttpError if lastValueFrom throws', async () => {
      // Given
      const errorMock = new ChecktokenHttpStatusException(axiosErrorMock);
      service['fetchToken'] = jest.fn().mockRejectedValueOnce(errorMock);
      service['checktokenHttpError'] = jest.fn().mockImplementation(() => {
        throw errorMock;
      });

      // When / Then
      await expect(service.checktoken(tokenMock)).rejects.toThrowError(
        errorMock,
      );
      expect(service['checktokenHttpError']).toHaveBeenCalledTimes(1);
      expect(service['checktokenHttpError']).toHaveBeenCalledWith(errorMock);
    });

    it('should call getDecryptedAndVerifiedToken', async () => {
      // When
      await service.checktoken(tokenMock);

      // Then
      expect(service['getDecryptedAndVerifiedToken']).toHaveBeenCalledTimes(1);
      expect(service['getDecryptedAndVerifiedToken']).toHaveBeenCalledWith(
        responseMock.data,
      );
    });

    it('should return claims', async () => {
      // When
      const result = await service.checktoken(tokenMock);

      // Then
      expect(result).toEqual(claimsMock);
    });
  });

  describe('fetchToken', () => {
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
      service['checktokenHttpError'] = jest.fn();
      configServiceMock.get.mockReturnValue(configMock);
      mocked(lastValueFrom).mockResolvedValue(responseMock);
    });

    it('should retrieve the DataProviderAdapterCore configuration', async () => {
      // When
      await service['fetchToken'](tokenMock);

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
      await service['fetchToken'](tokenMock);

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
      const result = await service['fetchToken'](tokenMock);

      // Then
      expect(result).toStrictEqual(responseMock);
    });
  });

  describe('getDecryptedAndVerifiedToken', () => {
    const signJwksMock = {};
    const tokenMock = 'token';
    const issuerMock = 'issuerMock';
    const jwksMock = {};

    beforeEach(() => {
      service['fetchSignKeys'] = jest.fn().mockResolvedValue(signJwksMock);
      configServiceMock.get.mockReturnValue({
        issuer: issuerMock,
        jwksEndpoint: 'jwksEndpointMock',
        jwks: jwksMock,
      });
    });

    it('should call configuration to retrieve parameters', async () => {
      // When
      await service['getDecryptedAndVerifiedToken'](tokenMock);

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith(
        'DataProviderAdapterCore',
      );
    });

    it('should fetch signingKeys', async () => {
      // When
      await service['getDecryptedAndVerifiedToken'](tokenMock);

      // Then
      expect(service['fetchSignKeys']).toHaveBeenCalledTimes(1);
      expect(service['fetchSignKeys']).toHaveBeenCalledWith('jwksEndpointMock');
    });

    it('should decrypt token', async () => {
      // When
      await service['getDecryptedAndVerifiedToken'](tokenMock);

      // Then
      expect(jwtServiceMock.decrypt).toHaveBeenCalledTimes(1);
      expect(jwtServiceMock.decrypt).toHaveBeenCalledWith(tokenMock, jwksMock);
    });

    it('should call verify', async () => {
      // Given
      const decryptedTokenMock = 'decryptedTokenMock';
      jwtServiceMock.decrypt.mockReturnValue(decryptedTokenMock);

      // When
      await service['getDecryptedAndVerifiedToken'](tokenMock);

      // Then
      expect(jwtServiceMock.verify).toHaveBeenCalledTimes(1);
      expect(jwtServiceMock.verify).toHaveBeenCalledWith(
        decryptedTokenMock,
        issuerMock,
        signJwksMock,
      );
    });

    it('should return claims from signed payload', async () => {
      // Given
      const claimsMock = {};
      jwtServiceMock.verify.mockReturnValue(claimsMock);

      // When
      const result = await service['getDecryptedAndVerifiedToken'](tokenMock);

      // Then
      expect(result).toBe(claimsMock);
    });
  });

  describe('fetchSignKeys', () => {
    it('should call the signkeys endpoint with the given URL', async () => {
      // Given
      const urlMock = 'url';
      mocked(lastValueFrom).mockResolvedValue({ data: 'data' });

      // When
      await service['fetchSignKeys'](urlMock);

      // Then
      expect(HttpServiceMock.get).toHaveBeenCalledTimes(1);
      expect(HttpServiceMock.get).toHaveBeenCalledWith(urlMock);
    });

    it('should throw if fetch fails', async () => {
      // Given
      const urlMock = 'url';
      const errorMock = new Error('error');
      mocked(lastValueFrom).mockRejectedValue(errorMock);

      // When / Then
      await expect(service['fetchSignKeys'](urlMock)).rejects.toThrowError(
        JwksFetchFailedException,
      );
    });

    it('should return the response data', async () => {
      // Given
      const urlMock = 'url';
      const responseMock = { data: 'data' };
      mocked(lastValueFrom).mockResolvedValue(responseMock);

      // When
      const result = await service['fetchSignKeys'](urlMock);

      // Then
      expect(result).toStrictEqual(responseMock.data);
    });
  });
  describe('checktokenHttpError', () => {
    it('should throw ChecktokenTimeoutException', () => {
      const error = {
        code: 'ETIMEDOUT',
        ...axiosErrorMock,
      } as AxiosError<{
        error: string;
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: string;
      }>;

      expect(() => service['checktokenHttpError'](error)).toThrowError(
        ChecktokenTimeoutException,
      );
    });

    it('should throw ChecktokenTimeoutException', () => {
      const error = {
        code: 'ECONNABORTED',
        ...axiosErrorMock,
      } as AxiosError<{
        error: string;
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: string;
      }>;

      expect(() => service['checktokenHttpError'](error)).toThrowError(
        ChecktokenTimeoutException,
      );
    });

    it('should throw ChecktokenTimeoutException', () => {
      const error = {
        code: 'ECONNRESET',
        ...axiosErrorMock,
      } as AxiosError<{
        error: string;
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: string;
      }>;

      expect(() => service['checktokenHttpError'](error)).toThrowError(
        ChecktokenTimeoutException,
      );
    });

    it('should throw ChecktokenHttpStatusException', () => {
      const error = {
        code: 'SOME_CODE',
        ...axiosErrorMock,
      } as AxiosError<{
        error: string;
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: string;
      }>;

      expect(() => service['checktokenHttpError'](error)).toThrowError(
        ChecktokenHttpStatusException,
      );
    });
  });

  describe('checkEncryptAlgorithm', () => {
    it('should check if encrypt algorithm receive are the same that we have in config', () => {
      // Given
      const jwt = 'foo';
      jwtServiceMock.retrieveJwtHeaders.mockReturnValue({ alg: 'RSA-OAEP' });

      // When / Then
      expect(() =>
        service['checkEncryptAlgorithm'](jwt, encryptAlgorithm),
      ).toThrow(ChecktokenInvalidAlgorithmException);
    });
  });

  describe('checkEncryptEncoding', () => {
    it('should check if encrypt encoding receive are the same that we have in config', () => {
      // Given
      const jwt = 'foo';
      jwtServiceMock.retrieveJwtHeaders.mockReturnValue({ enc: 'A128GCM' });

      // When / Then
      expect(() =>
        service['checkEncryptEncoding'](jwt, encryptEncoding),
      ).toThrow(ChecktokenInvalidEncodingException);
    });
  });
});
