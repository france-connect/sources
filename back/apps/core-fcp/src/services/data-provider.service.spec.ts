import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { ValidationError } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import {
  DataProviderAdapterMongoService,
  DataProviderMetadata,
} from '@fc/data-provider-adapter-mongo';
import { JwtService } from '@fc/jwt';
import { LoggerService } from '@fc/logger-legacy';

import { getJwtServiceMock } from '@mocks/jwt';

import { ChecktokenRequestDto } from '../dto';
import {
  CoreFcpFetchDataProviderJwksFailed,
  InvalidChecktokenRequestException,
} from '../exceptions';
import { DataProviderService } from './data-provider.service';

jest.mock('rxjs');

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

const configServiceMock = {
  get: jest.fn(),
};

const logggerServiceMock = {
  trace: jest.fn(),
};

const dataProviderMock = {
  getByClientId: jest.fn(),
};

const httpServiceMock = {
  get: jest.fn(),
};

const jwtServiceMock = getJwtServiceMock();

const DataProviderMock = {
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  jwks_uri: 'jwks_uri',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  checktoken_endpoint_auth_signing_alg: 'checktoken_endpoint_auth_signing_alg',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  checktoken_encrypted_response_alg: 'checktoken_encrypted_response_alg',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  checktoken_encrypted_response_enc: 'checktoken_encrypted_response_enc',
} as unknown as DataProviderMetadata;

const configDataMock = {
  issuer: 'issuer',
  configuration: { jwks: {} },
};

describe('DataProviderService', () => {
  let service: DataProviderService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataProviderService,
        LoggerService,
        ConfigService,
        DataProviderAdapterMongoService,
        HttpService,
        JwtService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(logggerServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(DataProviderAdapterMongoService)
      .useValue(dataProviderMock)
      .overrideProvider(HttpService)
      .useValue(httpServiceMock)
      .overrideProvider(JwtService)
      .useValue(jwtServiceMock)
      .compile();

    service = module.get<DataProviderService>(DataProviderService);

    dataProviderMock.getByClientId.mockResolvedValue(DataProviderMock);

    configServiceMock.get.mockReturnValue(configDataMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkRequestValid', () => {
    let validateDtoMock: any;
    beforeEach(() => {
      validateDtoMock = jest.mocked(validateDto);
    });

    it('should return true when the request token is valid', async () => {
      // Given
      const requestTokenMock: ChecktokenRequestDto = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id:
          '423dcbdc5a15ece61ed00ff5989d72379c26d9ed4c8e4e05a87cffae019586e0',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_secret:
          'jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        access_token: 'acces_token',
      };
      validateDtoMock.mockResolvedValueOnce([
        /* No error */
      ]);

      // When / Then
      await expect(
        service.checkRequestValid(requestTokenMock),
      ).resolves.not.toThrow();
    });

    it('should throw an error when the request token is invalid', async () => {
      // Given
      const requestTokenMock: ChecktokenRequestDto = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: '',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_secret: '',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        access_token: '',
      };
      validateDtoMock.mockResolvedValueOnce([
        new Error('Unknown Error') as unknown as ValidationError,
      ]);
      // When
      await expect(
        service.checkRequestValid(requestTokenMock),
        // Then
      ).rejects.toThrow(InvalidChecktokenRequestException);
    });
  });

  describe('generateJwt', () => {
    const payload = {};
    const dataProviderId = 'client_id';
    const jwsMock = Symbol('jws');
    const jweMock = Symbol('jwe');

    beforeEach(() => {
      service['generateJws'] = jest.fn().mockResolvedValue(jwsMock);
      service['generateJwe'] = jest.fn().mockResolvedValue(jweMock);
    });

    it('should fetch dataProvider by client_id', async () => {
      // When
      await service.generateJwt(payload, dataProviderId);

      // Then
      expect(dataProviderMock.getByClientId).toHaveBeenCalledTimes(1);
      expect(dataProviderMock.getByClientId).toHaveBeenCalledWith(
        dataProviderId,
      );
    });

    it('should call generateJws', async () => {
      // When
      await service.generateJwt(payload, dataProviderId);

      // Then
      expect(service['generateJws']).toHaveBeenCalledTimes(1);
      expect(service['generateJws']).toHaveBeenCalledWith(
        payload,
        DataProviderMock,
      );
    });

    it('should call generateJwe', async () => {
      // When
      await service.generateJwt(payload, dataProviderId);

      // Then
      expect(service['generateJwe']).toHaveBeenCalledTimes(1);
      expect(service['generateJwe']).toHaveBeenCalledWith(
        jwsMock,
        DataProviderMock,
      );
    });

    it('should return the generated jwt', async () => {
      // When
      const result = await service.generateJwt(payload, dataProviderId);

      // Then
      expect(result).toEqual(jweMock);
    });
  });

  describe('generateJws', () => {
    // Given
    const payload = {};
    const jwsMock = Symbol('jws');

    beforeEach(() => {
      jwtServiceMock.sign.mockReturnValue(jwsMock);
    });

    it('should get signing and encryption keys', async () => {
      // When
      await service['generateJws'](
        payload,
        DataProviderMock as DataProviderMetadata,
      );

      // Then
      expect(jwtServiceMock.getFirstRelevantKey).toHaveBeenCalledTimes(1);
      expect(jwtServiceMock.getFirstRelevantKey).toHaveBeenCalledWith(
        configDataMock.configuration.jwks,
        DataProviderMock.checktoken_endpoint_auth_signing_alg,
        'sig',
      );
    });

    it('should sign token', async () => {
      // Given
      const sigKey = {};
      const encKey = {};

      jwtServiceMock.getFirstRelevantKey
        .mockReturnValueOnce(sigKey)
        .mockReturnValueOnce(encKey);
      // When
      await service['generateJws'](
        payload,
        DataProviderMock as DataProviderMetadata,
      );

      // Then
      expect(jwtServiceMock.sign).toHaveBeenCalledTimes(1);
      expect(jwtServiceMock.sign).toHaveBeenCalledWith(
        payload,
        configDataMock.issuer,
        sigKey,
      );
    });

    it('should return signed token', async () => {
      // When
      const result = await service['generateJws'](payload, DataProviderMock);

      // Then
      expect(result).toBe(jwsMock);
    });
  });

  describe('generateJwe', () => {
    // Given
    const payload = {};
    const dataProviderJwksMock = {};
    const dataProviderId = 'client_id';
    const jwsMock = Symbol('jws') as unknown as string;
    const jweMock = Symbol('jwe');

    beforeEach(() => {
      service['fetchEncryptionKeys'] = jest
        .fn()
        .mockResolvedValue(dataProviderJwksMock);
      jwtServiceMock.encrypt.mockReturnValue(jweMock);
    });

    it('should fetch encryption keys', async () => {
      // When
      await service['generateJwe'](jwsMock, DataProviderMock);

      // Then
      expect(service['fetchEncryptionKeys']).toHaveBeenCalledTimes(1);
      expect(service['fetchEncryptionKeys']).toHaveBeenCalledWith(
        DataProviderMock.jwks_uri,
      );
    });

    it('should seek first relevant key', async () => {
      // When
      await service['generateJwe'](jwsMock, DataProviderMock);

      // Then
      expect(jwtServiceMock.getFirstRelevantKey).toHaveBeenCalledWith(
        dataProviderJwksMock,
        DataProviderMock.checktoken_encrypted_response_alg,
        'enc',
      );
    });

    it('should encrypt signed token', async () => {
      // Given
      const sigKey = {};
      const encKey = {};

      jwtServiceMock.getFirstRelevantKey
        .mockReturnValueOnce(sigKey)
        .mockReturnValueOnce(encKey);
      // When
      await service['generateJwe'](jwsMock, DataProviderMock);

      // Then
      expect(jwtServiceMock.encrypt).toHaveBeenCalledTimes(1);
      expect(jwtServiceMock.encrypt).toHaveBeenCalledWith(
        jwsMock,
        encKey,
        DataProviderMock.checktoken_encrypted_response_enc,
      );
    });

    it('should return encrypted signed token', async () => {
      // When
      const result = await service.generateJwt(payload, dataProviderId);

      // Then
      expect(result).toEqual(jweMock);
    });
  });

  describe('fetchEncryptionKeys', () => {
    it('should call the signkeys endpoint with the given URL', async () => {
      // Given
      const urlMock = 'url';
      jest.mocked(lastValueFrom).mockResolvedValue({ data: 'data' });

      // When
      await service['fetchEncryptionKeys'](urlMock);

      // Then
      expect(httpServiceMock.get).toHaveBeenCalledTimes(1);
      expect(httpServiceMock.get).toHaveBeenCalledWith(urlMock);
    });

    it('should throw if fetch fails', async () => {
      // Given
      const urlMock = 'url';
      const errorMock = new Error('error');
      jest.mocked(lastValueFrom).mockRejectedValue(errorMock);

      // When / Then
      await expect(
        service['fetchEncryptionKeys'](urlMock),
      ).rejects.toThrowError(CoreFcpFetchDataProviderJwksFailed);
    });

    it('should return the response data', async () => {
      // Given
      const urlMock = 'url';
      const responseMock = { data: 'data' };
      jest.mocked(lastValueFrom).mockResolvedValue(responseMock);

      // When
      const result = await service['fetchEncryptionKeys'](urlMock);

      // Then
      expect(result).toStrictEqual(responseMock.data);
    });
  });
});
