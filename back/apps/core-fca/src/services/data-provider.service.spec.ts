import { ValidationError } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AccountFca, AccountFcaService } from '@fc/account-fca';
import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import {
  ChecktokenRequestDto,
  DpJwtPayloadInterface,
  InvalidChecktokenRequestException,
  TokenIntrospectionInterface,
} from '@fc/core';
import { DataProviderMetadata } from '@fc/data-provider-adapter-mongo';
import { JwtService } from '@fc/jwt';
import { LoggerService } from '@fc/logger';
import { atHashFromAccessToken, stringToArray } from '@fc/oidc';
import { OidcProviderRedisAdapter } from '@fc/oidc-provider/adapters';
import { RedisService } from '@fc/redis';
import { SessionService } from '@fc/session';

import { getJwtServiceMock } from '@mocks/jwt';
import { getLoggerMock } from '@mocks/logger';
import { getRedisServiceMock } from '@mocks/redis';
import { getSessionServiceMock } from '@mocks/session';

import { CoreFcaSession } from '../dto';
import { DataProviderService } from './data-provider.service';

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

const jwtServiceMock = getJwtServiceMock();

const DataProviderMock = {
  scopes: ['scope1'],
  jwks_uri: 'jwks_uri',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  checktoken_signed_response_alg: 'checktoken_signed_response_alg',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  checktoken_encrypted_response_alg: 'checktoken_encrypted_response_alg',
  // OIDC fashion naming
  // eslint-disable-next-line @typescript-eslint/naming-convention
  checktoken_encrypted_response_enc: 'checktoken_encrypted_response_enc',
  client_id: 'client_id',
} as unknown as DataProviderMetadata;

const configDataMock = {
  issuer: 'issuer',
  configuration: { jwks: {} },
};

const sessionServiceMock = getSessionServiceMock();

const spIdentityMock = {
  given_name: 'Edward',
  family_name: 'TEACH',
  email: 'eteach@fqdn.ext',
};

const idpIdentityMock = {
  sub: 'validSubValue',
};

const idpIdMock = 'validIdValue';

const sessionDataMock = {
  OidcClient: {
    spIdentity: spIdentityMock,
    idpIdentity: idpIdentityMock,
    idpId: idpIdMock,
  },
};

const redisMock = getRedisServiceMock();

const accountFcaServiceMock = {
  getAccountByIdpAgentKeys: jest.fn(),
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
        JwtService,
        RedisService,
        SessionService,
        AccountFcaService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(JwtService)
      .useValue(jwtServiceMock)
      .overrideProvider(RedisService)
      .useValue(redisMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(AccountFcaService)
      .useValue(accountFcaServiceMock)
      .compile();

    service = module.get<DataProviderService>(DataProviderService);

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
        client_id:
          '423dcbdc5a15ece61ed00ff5989d72379c26d9ed4c8e4e05a87cffae019586e0',
        client_secret:
          'jClItOnQiSZdE4kxm7EWzJbz4ckfD89k1e3NJw/pbGRHD/Jp6ooupqmHTyc3b62L9wqyF2TlR/5hJejE',
        token: 'acces_token',
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
        client_id: '',
        client_secret: '',
        token: '',
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
    const tokenIntrospection = {} as unknown as TokenIntrospectionInterface;
    const jwsMock = Symbol('jws');
    const jweMock = Symbol('jwe');

    beforeEach(() => {
      service['generateJws'] = jest.fn().mockResolvedValue(jwsMock);
      service['generateJwe'] = jest.fn().mockResolvedValue(jweMock);
    });

    it('should call generateJws', async () => {
      // When
      await service.generateJwt(tokenIntrospection, DataProviderMock);

      // Then
      expect(service['generateJws']).toHaveBeenCalledTimes(1);
      expect(service['generateJws']).toHaveBeenCalledWith(
        {
          token_introspection: tokenIntrospection,
        },
        DataProviderMock,
      );
    });

    it('should call generateJwe', async () => {
      // When
      await service.generateJwt(tokenIntrospection, DataProviderMock);

      // Then
      expect(service['generateJwe']).toHaveBeenCalledTimes(1);
      expect(service['generateJwe']).toHaveBeenCalledWith(
        jwsMock,
        DataProviderMock,
      );
    });

    it('should return the generated jwt', async () => {
      // When
      const result = await service.generateJwt(
        tokenIntrospection,
        DataProviderMock,
      );

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

    it('should get session id and data from session service', async () => {
      // When
      await service.getSessionByAccessToken(atHashMock);

      // Then
      expect(sessionServiceMock.getAlias).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.getAlias).toHaveBeenCalledWith(atHashMock);
      expect(sessionServiceMock.getDataFromBackend).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.getDataFromBackend).toHaveBeenCalledWith(
        sessionIdMock,
      );
    });

    it('should return null if session id is not defined', async () => {
      // Given
      sessionServiceMock.getAlias.mockResolvedValue(undefined);

      // When
      const result = await service.getSessionByAccessToken(atHashMock);

      // Then
      expect(sessionServiceMock.getAlias).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.getAlias).toHaveBeenCalledWith(atHashMock);
      expect(result).toBe(null);
    });
  });

  describe('generateExpiredResponse', () => {
    it('should return a payload with an expired token', () => {
      // When
      const result = service['generateExpiredResponse']();

      // Then
      expect(result).toEqual({
        active: false,
      });
    });
  });

  describe('generateValidResponse', () => {
    const acrMock = ['acr', 'values'];
    const iatMock = 33;
    const expMock = 42;
    const jtiMock = 'jtiValue';
    const clientIdMock = 'clientIdValue';
    const scopeMock = 'some space separated values';
    const dpSubMock = 'dpSubMock value';

    const sessionMock = {
      spIdentity: {},
    };

    const interactionMock = {
      claims: {
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
      service['filterScopes'] = jest.fn().mockReturnValue(['space']);
    });

    it('should return a payload with an active token', async () => {
      // When
      const result = await service['generateValidResponse'](
        DataProviderMock,
        sessionDataMock as unknown as CoreFcaSession,
        interactionMock,
      );

      // Then
      expect(result).toEqual({
        active: true,
        acr: 'acr values',
        aud: 'clientIdValue',
        exp: 42,
        iat: 33,
        jti: 'jtiValue',
        scope: 'space',
        sub: 'dpSubMock value',
      });
    });

    it('should call generateDataProviderSub() with clientId from data provider', async () => {
      // When
      await service['generateValidResponse'](
        DataProviderMock,
        sessionDataMock as unknown as CoreFcaSession,
        interactionMock,
      );

      // Then
      expect(service['generateDataProviderSub']).toHaveBeenCalledTimes(1);
      expect(service['generateDataProviderSub']).toHaveBeenCalledWith(
        idpIdentityMock,
        idpIdMock,
      );
    });

    it('should call filterScopes() with scopes from data provider', async () => {
      // When
      await service['generateValidResponse'](
        DataProviderMock,
        sessionDataMock as unknown as CoreFcaSession,
        interactionMock,
      );

      // Then
      expect(service['filterScopes']).toHaveBeenCalledTimes(1);
      expect(service['filterScopes']).toHaveBeenCalledWith(
        DataProviderMock.scopes,
        interactionMock.scope,
      );
    });
  });

  describe('generateDataProviderSub', () => {
    it('should return a sub if an existing account is found', async () => {
      // Given
      accountFcaServiceMock.getAccountByIdpAgentKeys.mockResolvedValue({
        sub: 'validUniversalSubValue',
      } as AccountFca);

      // When
      const result = await service['generateDataProviderSub'](
        idpIdentityMock,
        idpIdMock,
      );

      // Then
      expect(
        accountFcaServiceMock.getAccountByIdpAgentKeys,
      ).toHaveBeenCalledTimes(1);
      expect(
        accountFcaServiceMock.getAccountByIdpAgentKeys,
      ).toHaveBeenCalledWith({
        idpUid: idpIdMock,
        idpSub: idpIdentityMock.sub,
      });
      expect(result).toBe('validUniversalSubValue');
    });

    it('should return undefined if no account exists', async () => {
      // Given
      accountFcaServiceMock.getAccountByIdpAgentKeys.mockResolvedValue(
        undefined,
      );

      // When
      const result = await service['generateDataProviderSub'](
        idpIdentityMock,
        idpIdMock,
      );

      // Then
      expect(
        accountFcaServiceMock.getAccountByIdpAgentKeys,
      ).toHaveBeenCalledTimes(1);
      expect(
        accountFcaServiceMock.getAccountByIdpAgentKeys,
      ).toHaveBeenCalledWith({
        idpUid: idpIdMock,
        idpSub: idpIdentityMock.sub,
      });
      expect(result).toBe(undefined);
    });
  });

  describe('generateIntrospectionToken', () => {
    // Given

    const adapterMocked = jest.mocked(OidcProviderRedisAdapter);
    const getExpireAndPayload = jest.fn();
    const adapterMock = () =>
      ({
        getExpireAndPayload: getExpireAndPayload,
      }) as unknown as OidcProviderRedisAdapter;

    const accessTokenMock = 'accessTokenMockValue';

    beforeEach(() => {
      service['generateExpiredResponse'] = jest.fn();
      service['generateValidResponse'] = jest.fn();

      adapterMocked.mockImplementation(adapterMock);
      getExpireAndPayload.mockResolvedValue({
        payload: {},
        expire: 42,
      });
    });

    it('should call adapterMock', async () => {
      // When
      await service['generateTokenIntrospection'](
        sessionDataMock as unknown as CoreFcaSession,
        accessTokenMock,
        DataProviderMock,
      );

      // Then
      expect(adapterMocked).toHaveBeenCalledTimes(1);
      expect(adapterMocked).toHaveBeenCalledWith(
        redisMock,
        undefined,
        'AccessToken',
      );
    });

    it('should return result of generateExpiredResponse() when access token is expired', async () => {
      // Given
      const expiredPayloadMock = Symbol('expiredPayload');
      service['generateExpiredResponse'] = jest
        .fn()
        .mockReturnValue(expiredPayloadMock);

      getExpireAndPayload.mockReset().mockResolvedValueOnce({
        expire: -1,
        payload: null,
      });
      // When
      const result = await service['generateTokenIntrospection'](
        sessionDataMock as unknown as CoreFcaSession,
        accessTokenMock,
        DataProviderMock,
      );
      // Then
      expect(result).toBe(expiredPayloadMock);
    });

    it('should return result of generateExpiredResponse() when session data is null', async () => {
      // Given
      const expiredPayloadMock = Symbol('expiredPayload');
      service['generateExpiredResponse'] = jest
        .fn()
        .mockReturnValue(expiredPayloadMock);

      const sessionDataMock = null;
      // When
      const result = await service['generateTokenIntrospection'](
        sessionDataMock as unknown as CoreFcaSession,
        accessTokenMock,
        DataProviderMock,
      );
      // Then
      expect(result).toBe(expiredPayloadMock);
    });

    it('should return result of generateValidResponse()', async () => {
      // Given
      const validPayloadMock = Symbol('validPayload');
      service['generateValidResponse'] = jest
        .fn()
        .mockReturnValue(validPayloadMock);

      getExpireAndPayload.mockReset().mockResolvedValueOnce({
        expire: 42,
        payload: {},
      });
      // When
      const result = await service['generateTokenIntrospection'](
        sessionDataMock as unknown as CoreFcaSession,
        accessTokenMock,
        DataProviderMock,
      );
      // Then
      expect(result).toBe(validPayloadMock);
    });
  });

  describe('filterScopes', () => {
    const interactionScopeMock = 'scope1 scope2';

    const stringToArrayMock = jest.mocked(stringToArray);

    beforeEach(() => {
      stringToArrayMock.mockReturnValue(['scope1', 'scope2']);
    });

    it('should return only scopes related to the data provider', () => {
      // When
      const result = service['filterScopes'](['scope1'], interactionScopeMock);

      // Then
      expect(result).toEqual(['scope1']);
    });

    it('should return empty string if no scopes related to the data provider', () => {
      // When
      const result = service['filterScopes'](['scope3'], interactionScopeMock);

      // Then
      expect(result).toEqual([]);
    });

    it('should return empty string if no scopes supported by the data provider', () => {
      // When
      const result = service['filterScopes']([], interactionScopeMock);

      // Then
      expect(result).toEqual([]);
    });
  });

  describe('generateJws', () => {
    // Given
    const payload = {} as unknown as DpJwtPayloadInterface;
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
        DataProviderMock.checktoken_signed_response_alg,
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
        DataProviderMock.client_id,
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
    const tokenIntrospection = {} as TokenIntrospectionInterface;
    const dataProviderJwksMock = {};
    const jwsMock = Symbol('jws') as unknown as string;
    const jweMock = Symbol('jwe');

    beforeEach(() => {
      jwtServiceMock.fetchJwks.mockReturnValue(dataProviderJwksMock);
      jwtServiceMock.encrypt.mockReturnValue(jweMock);
    });

    it('should fetch encryption keys', async () => {
      // When
      await service['generateJwe'](jwsMock, DataProviderMock);

      // Then
      expect(jwtServiceMock.fetchJwks).toHaveBeenCalledTimes(1);
      expect(jwtServiceMock.fetchJwks).toHaveBeenCalledWith(
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
      const result = await service.generateJwt(
        tokenIntrospection,
        DataProviderMock,
      );

      // Then
      expect(result).toEqual(jweMock);
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
        error_description: 'Error message description',
      });
    });

    it('should send predefined message if http status code is 500', () => {
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
        error_description:
          'The authorization server encountered an unexpected condition that prevented it from fulfilling the request.',
      });
    });
  });
});
