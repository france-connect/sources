import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { ValidationError } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyFcpService } from '@fc/cryptography-fcp';
import {
  DataProviderAdapterMongoService,
  DataProviderMetadata,
} from '@fc/data-provider-adapter-mongo';
import { CustomJwtPayload, JwtService } from '@fc/jwt';
import { LoggerService } from '@fc/logger';
import { AccessToken, atHashFromAccessToken, stringToArray } from '@fc/oidc';
import { OidcProviderRedisAdapter } from '@fc/oidc-provider/adapters';
import { RedisService } from '@fc/redis';
import { RnippPivotIdentity } from '@fc/rnipp';
import { ScopesService } from '@fc/scopes';
import { SessionService } from '@fc/session';

import { getJwtServiceMock } from '@mocks/jwt';
import { getLoggerMock } from '@mocks/logger';
import { getRedisServiceMock } from '@mocks/redis';
import { getSessionServiceMock } from '@mocks/session';

import { ChecktokenRequestDto, CoreFcpSession } from '../dto';
import {
  CoreFcpFetchDataProviderJwksFailedException,
  InvalidChecktokenRequestException,
} from '../exceptions';
import { DpJwtPayloadInterface } from '../interfaces';
import { DataProviderService } from './data-provider.service';

jest.mock('rxjs');
jest.mock('@fc/oidc');

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

jest.mock('@fc/oidc-provider/adapters');

const configServiceMock = {
  get: jest.fn(),
};

const loggerServiceMock = getLoggerMock();
const dataProviderMock = {
  getByClientId: jest.fn(),
};

const httpServiceMock = {
  get: jest.fn(),
};

const jwtServiceMock = getJwtServiceMock();

const DataProviderMock = {
  slug: 'SLUG',
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

const sessionServiceMock = getSessionServiceMock();

const sessionDataMock = {
  OidcClient: {
    rnippIdentity: { mockedRnippProperty: Symbol('mockedRnippProperty') },
  },
};

const redisMock = getRedisServiceMock();

const scopesMock = {
  getScopesByDataProvider: jest.fn(),
};

describe('DataProviderService', () => {
  let service: DataProviderService;

  const cryptographyFcpMock = {
    computeIdentityHash: jest.fn(),
    computeSubV1: jest.fn(),
  };

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
        RedisService,
        SessionService,
        CryptographyFcpService,
        ScopesService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(DataProviderAdapterMongoService)
      .useValue(dataProviderMock)
      .overrideProvider(HttpService)
      .useValue(httpServiceMock)
      .overrideProvider(JwtService)
      .useValue(jwtServiceMock)
      .overrideProvider(RedisService)
      .useValue(redisMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(CryptographyFcpService)
      .useValue(cryptographyFcpMock)
      .overrideProvider(ScopesService)
      .useValue(scopesMock)
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
    const payload = {} as unknown as CustomJwtPayload<DpJwtPayloadInterface>;
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

  describe('getSessionByAccessToken', () => {
    const atHashMock = 'at_hash';
    const sessionIdMock = 'session_id';

    beforeEach(() => {
      jest.mocked(atHashFromAccessToken).mockReturnValue(atHashMock);
      sessionServiceMock.getAlias.mockResolvedValue(sessionIdMock);
    });

    it('should get at_hash from access token', async () => {
      // When
      await service.getSessionByAccessToken(atHashMock);

      // Then
      expect(atHashFromAccessToken).toHaveBeenCalledTimes(1);
      expect(atHashFromAccessToken).toHaveBeenCalledWith({ jti: atHashMock });
    });

    it('should get session id from session service', async () => {
      // When
      await service.getSessionByAccessToken(atHashMock);

      // Then
      expect(sessionServiceMock.getAlias).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.getAlias).toHaveBeenCalledWith(atHashMock);
    });
  });

  describe('generateExpiredPayload', () => {
    const audMock = 'clientId';

    it('should return a payload with an expired token', () => {
      // When
      const result = service['generateExpiredPayload'](audMock);

      // Then
      expect(result).toEqual({
        // OIDC defined var name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        token_introspection: {
          active: false,
        },
        aud: audMock,
      });
    });
  });

  describe('generateValidPayload', () => {
    const dpClientIdMock = 'dataProvider ClientId';
    const acrMock = ['acr', 'values'];
    const iatMock = 33;
    const expMock = 42;
    const jtiMock = 'jtiValue';
    const clientIdMock = 'clientIdValue';
    const scopeMock = 'some space separated values';
    const dpSubMock = 'dpSubMock value';

    const sessionMock = {
      rnippIdentity: {},
    };

    const interactionMock = {
      claims: {
        // OIDC defined var name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        id_token: {
          acr: { values: acrMock },
        },
      },
      iat: iatMock,
      exp: expMock,
      jti: jtiMock,
      clientId: clientIdMock,
      scope: scopeMock,
    };

    beforeEach(() => {
      sessionServiceMock.get.mockReturnValueOnce(sessionMock);
      service['generateDataProviderSub'] = jest.fn().mockReturnValue(dpSubMock);
      service['getDpRelatedScopes'] = jest.fn().mockResolvedValue(['space']);
    });

    it('should return a payload with an active token', async () => {
      // When
      const result = await service['generateValidPayload'](
        dpClientIdMock,
        sessionDataMock as unknown as CoreFcpSession,
        interactionMock,
      );

      // Then
      expect(result).toEqual({
        // OIDC defined var name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        token_introspection: {
          active: true,
          acr: 'acr values',
          aud: 'clientIdValue',
          exp: 42,
          iat: 33,
          jti: 'jtiValue',
          scope: 'space',
          sub: 'dpSubMock value',
          mockedRnippProperty:
            sessionDataMock.OidcClient.rnippIdentity.mockedRnippProperty,
        },
        aud: 'dataProvider ClientId',
      });
    });

    it('should call generateDataProviderSub() with rnippIdentity from session and dpClientId from interaction (accessToken)', async () => {
      // When
      await service['generateValidPayload'](
        dpClientIdMock,
        sessionDataMock as unknown as CoreFcpSession,
        interactionMock,
      );

      // Then
      expect(service['generateDataProviderSub']).toHaveBeenCalledTimes(1);
      expect(service['generateDataProviderSub']).toHaveBeenCalledWith(
        sessionDataMock.OidcClient.rnippIdentity,
        dpClientIdMock,
      );
    });

    it('should call getDpRelatedScopes() with dpClientId and interaction', async () => {
      // When
      await service['generateValidPayload'](
        dpClientIdMock,
        sessionDataMock as unknown as CoreFcpSession,
        interactionMock,
      );

      // Then
      expect(service['getDpRelatedScopes']).toHaveBeenCalledTimes(1);
      expect(service['getDpRelatedScopes']).toHaveBeenCalledWith(
        dpClientIdMock,
        interactionMock,
      );
    });
  });

  describe('generatePayload', () => {
    // Given

    const adapterMocked = jest.mocked(OidcProviderRedisAdapter);
    const getExpireAndPayload = jest.fn();
    const adapterMock = () =>
      ({
        getExpireAndPayload: getExpireAndPayload,
      }) as unknown as OidcProviderRedisAdapter;

    const accessTokenMock = 'accessTokenMockValue';

    beforeEach(() => {
      service['generateExpiredPayload'] = jest.fn();
      service['generateValidPayload'] = jest.fn();

      adapterMocked.mockImplementation(adapterMock);
      getExpireAndPayload.mockResolvedValue({
        payload: {},
        expire: 42,
      });
    });

    it('should call adapterMock', async () => {
      // When
      await service['generatePayload'](
        sessionDataMock as unknown as CoreFcpSession,
        accessTokenMock,
        'dpClientId',
      );

      // Then
      expect(adapterMocked).toHaveBeenCalledTimes(1);
      expect(adapterMocked).toHaveBeenCalledWith(
        redisMock,
        undefined,
        'AccessToken',
      );
    });

    it('should return result of generateExpiredPayload()', async () => {
      // Given
      const expiredPayloadMock = Symbol('expiredPayload');
      service['generateExpiredPayload'] = jest
        .fn()
        .mockReturnValue(expiredPayloadMock);

      getExpireAndPayload.mockReset().mockResolvedValueOnce({
        expire: -1,
        payload: null,
      });
      // When
      const result = await service['generatePayload'](
        sessionDataMock as unknown as CoreFcpSession,
        accessTokenMock,
        'dpClientId',
      );
      // Then
      expect(result).toBe(expiredPayloadMock);
    });

    it('should return result of generateValidPayload()', async () => {
      // Given
      const validPayloadMock = Symbol('validPayload');
      service['generateValidPayload'] = jest
        .fn()
        .mockReturnValue(validPayloadMock);

      getExpireAndPayload.mockReset().mockResolvedValueOnce({
        expire: 42,
        payload: {},
      });
      // When
      const result = await service['generatePayload'](
        sessionDataMock as unknown as CoreFcpSession,
        accessTokenMock,
        'dpClientId',
      );
      // Then
      expect(result).toBe(validPayloadMock);
    });
  });

  describe('getDpRelatedScopes', () => {
    const dpClientIdMock = 'dpClientId';
    const interactionMock = {
      scope: 'scope1 scope2',
    } as AccessToken;

    const stringToArrayMock = jest.mocked(stringToArray);

    beforeEach(() => {
      scopesMock.getScopesByDataProvider.mockReturnValue(['scope1']);
      stringToArrayMock.mockReturnValue(['scope1', 'scope2']);
    });

    it('should fetch slug from dataProviderService', async () => {
      // When
      await service['getDpRelatedScopes'](dpClientIdMock, interactionMock);

      // Then
      expect(dataProviderMock.getByClientId).toHaveBeenCalledTimes(1);
      expect(dataProviderMock.getByClientId).toHaveBeenCalledWith(
        dpClientIdMock,
      );
    });

    it('should get scopes related to dpClientId', async () => {
      // When
      await service['getDpRelatedScopes'](dpClientIdMock, interactionMock);

      // Then
      expect(scopesMock.getScopesByDataProvider).toHaveBeenCalledTimes(1);
      expect(scopesMock.getScopesByDataProvider).toHaveBeenCalledWith(
        DataProviderMock.slug,
      );
    });

    it('should return the scopes intersection', async () => {
      // When
      const result = await service['getDpRelatedScopes'](
        dpClientIdMock,
        interactionMock,
      );

      // Then
      expect(result).toEqual(['scope1']);
    });
  });

  describe('generateDataProviderSub', () => {
    const rnippIdentityMock = Symbol(
      'rnippIdentity',
    ) as unknown as RnippPivotIdentity;
    const clientIdMock = 'client_id';
    const identityHashMock = 'identity_hash';
    const subMock = 'sub';

    beforeEach(() => {
      jest
        .mocked(cryptographyFcpMock.computeIdentityHash)
        .mockReturnValue(identityHashMock);
      jest.mocked(cryptographyFcpMock.computeSubV1).mockReturnValue(subMock);
    });

    it('should compute identity hash', () => {
      // When
      service['generateDataProviderSub'](rnippIdentityMock, clientIdMock);

      // Then
      expect(cryptographyFcpMock.computeIdentityHash).toHaveBeenCalledTimes(1);
      expect(cryptographyFcpMock.computeIdentityHash).toHaveBeenCalledWith(
        rnippIdentityMock,
      );
    });

    it('should compute sub', () => {
      // When
      service['generateDataProviderSub'](rnippIdentityMock, clientIdMock);

      // Then
      expect(cryptographyFcpMock.computeSubV1).toHaveBeenCalledTimes(1);
      expect(cryptographyFcpMock.computeSubV1).toHaveBeenCalledWith(
        clientIdMock,
        identityHashMock,
      );
    });

    it('should return the sub', () => {
      // When
      const result = service['generateDataProviderSub'](
        rnippIdentityMock,
        clientIdMock,
      );

      // Then
      expect(result).toBe(subMock);
    });
  });

  describe('generateJws', () => {
    // Given
    const payload = {} as unknown as CustomJwtPayload<DpJwtPayloadInterface>;
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
    const payload = {} as unknown as CustomJwtPayload<DpJwtPayloadInterface>;
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
      ).rejects.toThrowError(CoreFcpFetchDataProviderJwksFailedException);
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

  describe('generateErrorMessage', () => {
    const errorMock = 'foo_bar';
    const messageMock = 'Error message description';

    it('should send message retrieve through params if http status code is 400', () => {
      // Given
      const httpStatusCodeMock = 400;
      // When
      const result = service['generateErrorMessage'](
        httpStatusCodeMock,
        messageMock,
        errorMock,
      );
      // Then
      expect(result).toEqual({
        error: 'foo_bar',
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: 'Error message description',
      });
    });

    it('should send message retrieve through params if http status code is 401', () => {
      // Given
      const httpStatusCodeMock = 401;
      // When
      const result = service['generateErrorMessage'](
        httpStatusCodeMock,
        messageMock,
        errorMock,
      );
      // Then
      expect(result).toEqual({
        error: 'foo_bar',
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description: 'Error message description',
      });
    });

    it('should send predifined message if http status code is 500', () => {
      // Given
      const httpStatusCodeMock = 500;
      // When
      const result = service['generateErrorMessage'](
        httpStatusCodeMock,
        messageMock,
        errorMock,
      );
      // Then
      expect(result).toEqual({
        error: 'server_error',
        // oidc compliant
        // eslint-disable-next-line @typescript-eslint/naming-convention
        error_description:
          'The authorization server encountered an unexpected condition that prevented it from fulfilling the request.',
      });
    });
  });
});
