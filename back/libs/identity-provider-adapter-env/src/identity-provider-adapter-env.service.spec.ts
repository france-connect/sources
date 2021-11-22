import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger';
import { IdentityProviderMetadata } from '@fc/oidc';

import { IdentityProvider } from './enums';
import { IdentityProviderAdapterEnvService } from './identity-provider-adapter-env.service';

describe('IdentityProviderAdapterEnvService', () => {
  let service: IdentityProviderAdapterEnvService;

  const env = {
    provider: {
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: 'client_id',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_secret: '7vhnwzo1yUVOJT9GJ91gD5oid56effu1',
      discovery: true,
      discoveryUrl:
        'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/.well-known/openid-configuration',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_token_signed_response_alg: 'ES256',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      post_logout_redirect_uris: [
        'https://fsp1-high.docker.dev-franceconnect.fr/logout-callback',
      ],
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      redirect_uris: [
        'https://fsp1-high.docker.dev-franceconnect.fr/login-callback',
      ],
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      response_types: ['code'],
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      token_endpoint_auth_method: 'client_secret_post',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      revocation_endpoint_auth_method: 'client_secret_post',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_token_encrypted_response_alg: 'RSA-OAEP',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_token_encrypted_response_enc: 'A256GCM',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      userinfo_encrypted_response_alg: 'RSA-OAEP',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      userinfo_encrypted_response_enc: 'A256GCM',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      userinfo_signed_response_alg: 'ES256',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      jwks_uri: 'https://fsp1-high.docker.dev-franceconnect.fr/jwks_uri',
    },
  };

  const validIdentityProviderMock = {
    uid: IdentityProvider.IDP_ID,
    name: 'envIssuer',
    title: 'envIssuer Title',
    active: true,
    display: true,
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_id: 'client_id',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_secret: '7vhnwzo1yUVOJT9GJ91gD5oid56effu1',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    discovery: true,
    discoveryUrl:
      'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/.well-known/openid-configuration',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id_token_signed_response_alg: 'ES256',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    post_logout_redirect_uris: [
      'https://fsp1-high.docker.dev-franceconnect.fr/logout-callback',
    ],
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    redirect_uris: [
      'https://fsp1-high.docker.dev-franceconnect.fr/login-callback',
    ],
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    response_types: ['code'],
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    token_endpoint_auth_method: 'client_secret_post',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    revocation_endpoint_auth_method: 'client_secret_post',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id_token_encrypted_response_alg: 'RSA-OAEP',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id_token_encrypted_response_enc: 'A256GCM',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_encrypted_response_alg: 'RSA-OAEP',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_encrypted_response_enc: 'A256GCM',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_signed_response_alg: 'ES256',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    jwks_uri: 'https://fsp1-high.docker.dev-franceconnect.fr/jwks_uri',
  };

  const toPanvaFormatMock = {
    uid: 'envIssuer',
    title: 'envIssuer Title',
    name: 'envIssuer',
    display: true,
    active: true,
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    discovery: true,
    discoveryUrl:
      'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/.well-known/openid-configuration',
    issuer: {
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      jwks_uri: 'https://fsp1-high.docker.dev-franceconnect.fr/jwks_uri',
    },
    client: {
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: 'client_id',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_secret: '7vhnwzo1yUVOJT9GJ91gD5oid56effu1',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_token_signed_response_alg: 'ES256',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      post_logout_redirect_uris: [
        'https://fsp1-high.docker.dev-franceconnect.fr/logout-callback',
      ],
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      redirect_uris: [
        'https://fsp1-high.docker.dev-franceconnect.fr/login-callback',
      ],
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      response_types: ['code'],
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      token_endpoint_auth_method: 'client_secret_post',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      revocation_endpoint_auth_method: 'client_secret_post',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_token_encrypted_response_alg: 'RSA-OAEP',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_token_encrypted_response_enc: 'A256GCM',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      userinfo_encrypted_response_alg: 'RSA-OAEP',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      userinfo_encrypted_response_enc: 'A256GCM',
      // oidc param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      userinfo_signed_response_alg: 'ES256',
    },
  };

  const identityProviderListMock = [validIdentityProviderMock];

  const loggerMock = {
    setContext: jest.fn(),
    warn: jest.fn(),
  };

  const cryptographyMock = {
    decrypt: jest.fn(),
  };

  const configMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptographyService,
        IdentityProviderAdapterEnvService,
        LoggerService,
        ConfigService,
      ],
    })
      .overrideProvider(CryptographyService)
      .useValue(cryptographyMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .compile();

    service = module.get<IdentityProviderAdapterEnvService>(
      IdentityProviderAdapterEnvService,
    );

    configMock.get.mockReturnValue({
      provider: env.provider,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('legacyToOpenIdPropertyName', () => {
    it('should return identity provider with change legacy property name by openid property name', () => {
      // setup
      service['decryptClientSecret'] = jest
        .fn()
        .mockReturnValueOnce(toPanvaFormatMock.client.client_secret);

      // action
      const result = service['legacyToOpenIdPropertyName'](
        validIdentityProviderMock,
      );

      // expect
      expect(result).toEqual(toPanvaFormatMock);
    });
  });

  describe('findAllIdentityProvider', () => {
    it('should resolve', async () => {
      // action
      const result = service['findAllIdentityProvider']();

      // expect
      expect(result).toBeInstanceOf(Promise);
    });

    it('should return result of type list', async () => {
      // setup
      configMock.get.mockReturnValueOnce(env);

      // action
      const result = await service['findAllIdentityProvider']();

      // expect
      expect(result).toEqual(identityProviderListMock);
    });

    it('should log a warning if an entry is not validated by the DTO', async () => {
      // setup
      const invalidEnvMock = {
        ...env.provider,
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        jwks_uri: 'not an url',
      };
      configMock.get.mockReturnValueOnce({ provider: invalidEnvMock });

      // action
      await service['findAllIdentityProvider']();

      // expect
      expect(loggerMock.warn).toHaveBeenCalledTimes(1);
    });

    it('should log a warning if an entry is exluded by the DTO', async () => {
      // setup
      const invalidEnvMock = {
        ...env.provider,
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        not_validated: 'by DTO',
      };
      configMock.get.mockReturnValueOnce({
        provider: invalidEnvMock,
      });

      // action
      await service['findAllIdentityProvider']();

      // expect
      expect(loggerMock.warn).toHaveBeenCalledTimes(1);
    });
  });

  describe('getList', () => {
    it('should resolve', async () => {
      // action
      const result = service.getList();

      // expect
      expect(result).toBeInstanceOf(Promise);
    });

    it('should return a list of valids identity providers', async () => {
      // setup
      configMock.get.mockReturnValueOnce(env);
      const expected = toPanvaFormatMock;

      service['decryptClientSecret'] = jest
        .fn()
        .mockReturnValueOnce(expected.client.client_secret);

      // action
      const result = await service.getList();

      // expect
      expect(result).toEqual([expected]);
    });

    it('should call findAll method if refreshCache is true', async () => {
      // Given
      const refresh = true;
      const listMock = [
        {
          // oidc param name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_id: 'foo',
        },
        {
          // oidc param name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_id: 'bar',
        },
      ];
      service['findAllIdentityProvider'] = jest
        .fn()
        .mockResolvedValue(listMock);
      service['legacyToOpenIdPropertyName'] = jest
        .fn()
        .mockImplementation((input) => input);
      // When
      const result = await service.getList(refresh);
      // Then
      expect(service['findAllIdentityProvider']).toHaveBeenCalledTimes(1);
      expect(service['findAllIdentityProvider']).toHaveBeenCalledWith();
      expect(service['legacyToOpenIdPropertyName']).toHaveBeenCalledTimes(
        listMock.length,
      );
      expect(result).toEqual(listMock);
    });

    it('should not call findAll method if refreshCache is not set and cache exists', async () => {
      // Given
      service['identityProviderCache'] = [
        {
          client: {
            // oidc param name
            // eslint-disable-next-line @typescript-eslint/naming-convention
            client_id: 'foo',
          },
        } as IdentityProviderMetadata,
        {
          client: {
            // oidc param name
            // eslint-disable-next-line @typescript-eslint/naming-convention
            client_id: 'bar',
          },
        } as IdentityProviderMetadata,
      ];
      service['findAllIdentityProvider'] = jest.fn();
      // When
      const result = await service.getList();
      // Then
      expect(result).toBe(service['identityProviderCache']);
      expect(service['findAllIdentityProvider']).toHaveBeenCalledTimes(0);
    });
  });

  describe('getFilteredList', () => {
    beforeEach(() => {
      service['getList'] = jest
        .fn()
        .mockResolvedValueOnce(identityProviderListMock);
    });
    it('should resolve', async () => {
      // action
      const result = service.getFilteredList([], true);

      // expect
      expect(result).toBeInstanceOf(Promise);
    });

    it('should return a list of filtered whitelist identity providers', async () => {
      // setup
      const expected = [
        {
          ...validIdentityProviderMock,
        },
      ];
      service['decryptClientSecret'] = jest
        .fn()
        .mockReturnValueOnce(expected[0].client_secret);

      // action
      const result = await service.getFilteredList(['envIssuer'], false);

      // expect
      expect(result).toEqual(expected);
    });

    it('should return an empty list of filtered whitelist identity providers', async () => {
      // setup
      const expected = [
        {
          ...validIdentityProviderMock,
        },
      ];

      cryptographyMock.decrypt.mockReturnValueOnce(expected[0].client_secret);

      // action
      const result = await service.getFilteredList(['false_uid'], false);

      // expect
      expect(result).toEqual([]);
    });

    it('should return an empty list of filtered blacklist identity providers', async () => {
      const result = await service.getFilteredList(['envIssuer'], true);

      // expect
      expect(result).toEqual([]);
    });

    it('should return a list of filtered blacklist identity providers', async () => {
      // setup
      const expected = [
        {
          ...validIdentityProviderMock,
        },
      ];

      service['decryptClientSecret'] = jest
        .fn()
        .mockReturnValueOnce(expected[0].client_secret);

      // action
      const result = await service.getFilteredList(['false_uid'], true);

      // expect
      expect(result).toEqual(expected);
    });
  });

  describe('getById', () => {
    // Given
    const idpListMock = [{ uid: 'wizz' }, { uid: 'foo' }, { uid: 'bar' }];

    it('should return an existing IdP', async () => {
      // Given
      const idMock = 'foo';
      service.getList = jest.fn().mockResolvedValueOnce(idpListMock);
      // When
      const result = await service.getById(idMock);
      // Then
      expect(result).toEqual({ uid: 'foo' });
    });

    it('should return undefined for non existing IdP', async () => {
      // Given
      const idMock = 'nope';
      service.getList = jest.fn().mockResolvedValueOnce(idpListMock);
      // When
      const result = await service.getById(idMock);
      // Then
      expect(result).toBeUndefined();
    });

    it('should pass refresh flag to getList method', async () => {
      // Given
      const idMock = 'foo';
      const refresh = true;
      service.getList = jest.fn().mockResolvedValueOnce(idpListMock);
      // When
      await service.getById(idMock, refresh);
      // Then
      expect(service.getList).toHaveBeenCalledTimes(1);
      expect(service.getList).toHaveBeenCalledWith(refresh);
    });
  });

  describe('decryptClientSecret', () => {
    it('should get clientSecretEncryptKey from config', () => {
      // Given
      const clientSecretMock = 'some string';
      const clientSecretEncryptKey = 'Key';
      configMock.get.mockReturnValue({ clientSecretEncryptKey });

      // When
      service['decryptClientSecret'](clientSecretMock);
      // Then
      expect(configMock.get).toHaveBeenCalledTimes(1);
    });

    it('should call decrypt with enc key from config', () => {
      // Given
      const clientSecretMock = 'some string';
      const clientSecretEncryptKey = 'Key';
      configMock.get.mockReturnValue({ clientSecretEncryptKey });
      cryptographyMock.decrypt.mockReturnValue('totoIsDecrypted');
      // When
      service['decryptClientSecret'](clientSecretMock);
      // Then
      expect(cryptographyMock.decrypt).toHaveBeenCalledTimes(1);
      expect(cryptographyMock.decrypt).toHaveBeenCalledWith(
        clientSecretEncryptKey,
        Buffer.from(clientSecretMock, 'base64'),
      );
    });

    it('should return clientSecretEncryptKey', () => {
      // Given
      const clientSecretMock = 'some string';
      const clientSecretEncryptKey = 'Key';
      configMock.get.mockReturnValue({ clientSecretEncryptKey });
      cryptographyMock.decrypt.mockReturnValue('totoIsDecrypted');

      // When
      const result = service['decryptClientSecret'](clientSecretMock);
      // Then
      expect(result).toEqual('totoIsDecrypted');
    });
  });
});
