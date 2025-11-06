import { EventBus } from '@nestjs/cqrs';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger';
import { MongooseChangeStreamService } from '@fc/mongoose-change-stream';
import { Amr, IdentityProviderMetadata } from '@fc/oidc';

import { getLoggerMock } from '@mocks/logger';

import {
  DiscoveryIdpAdapterMongoDTO,
  NoDiscoveryIdpAdapterMongoDTO,
} from '../dto';
import { IdentityProvider } from '../schemas';
import { IdentityProviderAdapterMongoService } from './identity-provider-adapter-mongo.service';

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

describe('IdentityProviderAdapterMongoService', () => {
  let service: IdentityProviderAdapterMongoService;

  const legacyIdentityProviderMock = {
    active: true,
    authzURL:
      'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/authorize',
    clientID: 'clientID',
    amr: [Amr.MAIL, Amr.PWD],
    client_secret: '7vhnwzo1yUVOJT9GJ91gD5oid56effu1',
    discovery: false,
    display: false,
    allowedAcr: ['eidas2'],
    endSessionURL:
      'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/session/end',
    featureHandlers: {
      authenticationEmail: null,
      coreVerify: 'core-fcp-default-verify',
    },
    id_token_encrypted_response_alg: 'RSA-OAEP',
    id_token_encrypted_response_enc: 'A256GCM',
    id_token_signed_response_alg: 'HS256',
    image: 'provider1.png',
    jwksURL: 'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/certs',
    name: 'provider1',
    response_types: ['code'],
    revocation_endpoint_auth_method: 'client_secret_post',
    title: 'provider 1',
    tokenURL: 'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/token',
    token_endpoint_auth_method: 'client_secret_post',
    uid: 'uid',
    url: 'https://core-fcp-high.docker.dev-franceconnect.fr',
    userInfoURL:
      'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/userinfo',
    userinfo_encrypted_response_alg: 'RSA-OAEP',
    userinfo_encrypted_response_enc: 'A256GCM',
    userinfo_signed_response_alg: 'HS256',
  };

  const legacyToOpenIdPropertyNameOutputMock = {
    active: true,
    authorization_endpoint:
      'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/authorize',
    client_id: 'clientID',
    amr: [Amr.MAIL, Amr.PWD],
    client_secret: '7vhnwzo1yUVOJT9GJ91gD5oid56effu1',
    discovery: false,
    display: false,
    allowedAcr: ['eidas2'],
    end_session_endpoint:
      'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/session/end',
    featureHandlers: {
      authenticationEmail: null,
      coreVerify: 'core-fcp-default-verify',
    },
    id_token_encrypted_response_alg: 'RSA-OAEP',
    id_token_encrypted_response_enc: 'A256GCM',
    id_token_signed_response_alg: 'HS256',
    image: 'provider1.png',
    issuer: 'https://core-fcp-high.docker.dev-franceconnect.fr',
    jwks_uri: 'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/certs',
    name: 'provider1',
    response_types: ['code'],
    revocation_endpoint_auth_method: 'client_secret_post',
    title: 'provider 1',
    token_endpoint:
      'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/token',
    token_endpoint_auth_method: 'client_secret_post',
    uid: 'uid',
    userinfo_encrypted_response_alg: 'RSA-OAEP',
    userinfo_encrypted_response_enc: 'A256GCM',
    userinfo_endpoint:
      'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/userinfo',
    userinfo_signed_response_alg: 'HS256',
  };

  const validIdentityProviderMock = {
    active: true,
    client: {
      client_id: 'clientID',
      client_secret: '7vhnwzo1yUVOJT9GJ91gD5oid56effu1',
      id_token_encrypted_response_alg: 'RSA-OAEP',
      id_token_encrypted_response_enc: 'A256GCM',
      id_token_signed_response_alg: 'HS256',
      response_types: ['code'],
      revocation_endpoint_auth_method: 'client_secret_post',
      token_endpoint_auth_method: 'client_secret_post',
      userinfo_encrypted_response_alg: 'RSA-OAEP',
      userinfo_encrypted_response_enc: 'A256GCM',
      userinfo_signed_response_alg: 'HS256',
    },
    amr: [Amr.MAIL, Amr.PWD],
    discovery: false,
    display: false,
    allowedAcr: ['eidas2'],
    featureHandlers: {
      authenticationEmail: null,
      coreVerify: 'core-fcp-default-verify',
    },
    image: 'provider1.png',
    issuer: {
      authorization_endpoint:
        'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/authorize',
      end_session_endpoint:
        'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/session/end',
      issuer: 'https://core-fcp-high.docker.dev-franceconnect.fr',
      jwks_uri:
        'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/certs',
      token_endpoint:
        'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/token',
      userinfo_endpoint:
        'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/userinfo',
    },
    name: 'provider1',
    title: 'provider 1',
    uid: 'uid',
  };

  const invalidIdentityProviderMock = {
    ...legacyIdentityProviderMock,
    active: 'NOT_A_BOOLEAN',
  };

  const identityProviderListMock = [legacyIdentityProviderMock];

  const loggerMock = getLoggerMock();

  const cryptographyMock = {
    decrypt: jest.fn(),
  };

  const configMock = {
    get: jest.fn(),
  };

  const repositoryMock = {
    lean: jest.fn(),
    find: jest.fn(),
    sort: jest.fn(),
    watch: jest.fn(),
  };

  const eventBusMock = {
    publish: jest.fn(),
  };

  const changeStreamServiceMock = {
    registerWatcher: jest.fn(),
  };

  const identityProviderModel = getModelToken(IdentityProvider.name);

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptographyService,
        IdentityProviderAdapterMongoService,
        {
          provide: identityProviderModel,
          useValue: repositoryMock,
        },
        LoggerService,
        EventBus,
        ConfigService,
        MongooseChangeStreamService,
      ],
    })
      .overrideProvider(CryptographyService)
      .useValue(cryptographyMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(EventBus)
      .useValue(eventBusMock)
      .overrideProvider(MongooseChangeStreamService)
      .useValue(changeStreamServiceMock)
      .compile();

    service = module.get<IdentityProviderAdapterMongoService>(
      IdentityProviderAdapterMongoService,
    );

    repositoryMock.lean.mockResolvedValueOnce(identityProviderListMock);
    repositoryMock.find.mockReturnValueOnce(repositoryMock);
    repositoryMock.sort.mockReturnValueOnce(repositoryMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    beforeEach(() => {
      // Given
      service['getList'] = jest.fn();
    });

    it('should call getList', async () => {
      // When
      await service.onModuleInit();
      // Then
      expect(service['getList']).toHaveBeenCalledTimes(1);
      expect(service['getList']).toHaveBeenCalledWith();
    });

    it('should call registerWatcher method', async () => {
      // When
      await service.onModuleInit();
      // Then
      expect(
        changeStreamServiceMock.registerWatcher,
      ).toHaveBeenCalledExactlyOnceWith(repositoryMock, expect.any(Function));
    });
  });
  describe('refreshCache', () => {
    beforeEach(() => {
      // Given
      service.getList = jest.fn();
      configMock.get.mockReturnValueOnce({
        disableIdpValidationOnLegacy: false,
      });
    });
    it('should call getList method with true value in param', async () => {
      // When
      await service.refreshCache();
      // Then
      expect(service.getList).toHaveBeenCalledTimes(1);
      expect(service.getList).toHaveBeenCalledWith(true);
    });
  });

  describe('legacyToOpenIdPropertyName', () => {
    it('should return identity provider with change legacy property name by openid property name', () => {
      // Given
      service['decryptClientSecret'] = jest
        .fn()
        .mockReturnValueOnce(legacyIdentityProviderMock.client_secret);

      configMock.get.mockReturnValueOnce({
        fqdn: 'core-fcp-high.docker.dev-franceconnect.fr',
      });

      // When
      const result = service['legacyToOpenIdPropertyName'](
        legacyIdentityProviderMock as unknown as IdentityProvider,
      );

      // Then
      expect(result).toEqual(validIdentityProviderMock);
    });
  });

  describe('toPanvaFormat', () => {
    it('should return an object with data for FC and properties issuer and client for panva', () => {
      // When
      const result = service['toPanvaFormat'](
        legacyToOpenIdPropertyNameOutputMock as unknown,
      );

      // Then
      expect(result).toEqual(validIdentityProviderMock);
    });
  });

  describe('findAllIdentityProvider', () => {
    let validateDtoMock;
    beforeEach(() => {
      validateDtoMock = jest.mocked(validateDto);
      configMock.get.mockReturnValueOnce({
        disableIdpValidationOnLegacy: false,
      });
    });

    it('should resolve', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([]);

      // When
      const result = service['findAllIdentityProvider']();

      // Then
      expect(result).toBeInstanceOf(Promise);

      await result;
    });

    it('should have called find once', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([]);

      // When
      await service['findAllIdentityProvider']();

      // Then
      expect(repositoryMock.find).toHaveBeenCalledTimes(1);
    });

    it('should get the configuration', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([]);

      // When
      await service['findAllIdentityProvider']();

      // Then
      expect(configMock.get).toHaveBeenCalledTimes(1);
      expect(configMock.get).toHaveBeenCalledWith(
        'IdentityProviderAdapterMongo',
      );
    });

    it('should return result of type list', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([]);

      // When
      const result = await service['findAllIdentityProvider']();

      // Then
      expect(result).toEqual([legacyIdentityProviderMock]);
    });

    it('should not call validateDto if the config "disableIdpValidationOnLegacy" is set to "true"', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce(['there is an error']);
      configMock.get
        .mockReset()
        .mockReturnValueOnce({ disableIdpValidationOnLegacy: true });

      // When
      await service['findAllIdentityProvider']();

      // Then
      expect(validateDtoMock).toHaveBeenCalledTimes(0);
    });

    it('should log an alert if an entry is excluded by the DTO', async () => {
      // Given
      const invalidIdentityProviderListMock = [
        legacyIdentityProviderMock,
        invalidIdentityProviderMock,
      ];
      validateDtoMock
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(['there is an error']);

      repositoryMock.lean = jest
        .fn()
        .mockResolvedValueOnce(invalidIdentityProviderListMock);

      // When
      await service['findAllIdentityProvider']();

      // Then
      expect(loggerMock.alert).toHaveBeenCalledTimes(1);
      expect(loggerMock.alert).toHaveBeenCalledWith(
        `Identity provider "${invalidIdentityProviderMock.name}" (${invalidIdentityProviderMock.uid}) was excluded at DTO validation`,
      );
    });

    it('should filter out any entry exluded by the DTO', async () => {
      // Given
      const invalidIdentityProviderListMock = [
        legacyIdentityProviderMock,
        invalidIdentityProviderMock,
      ];
      validateDtoMock
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(['there is an error']);

      repositoryMock.lean = jest
        .fn()
        .mockResolvedValueOnce(invalidIdentityProviderListMock);

      // When
      const result = await service['findAllIdentityProvider']();

      // Then
      expect(result).toEqual(identityProviderListMock);
    });
  });

  describe('getList', () => {
    beforeEach(() => {
      service['findAllIdentityProvider'] = jest
        .fn()
        .mockResolvedValueOnce(identityProviderListMock);
    });

    it('should resolve', async () => {
      // Given
      const legacyToOpenIdMock = jest.spyOn<
        IdentityProviderAdapterMongoService,
        any
      >(service, 'legacyToOpenIdPropertyName');
      legacyToOpenIdMock.mockImplementationOnce((data) => data);

      // When
      const result = service.getList();

      // Then
      expect(result).toBeInstanceOf(Promise);

      await result;
    });

    it('should return a list of valides identity providers', async () => {
      // Given
      // change client_id and client_secret in validIdentityProviderMock
      const expected = [
        Object.assign(validIdentityProviderMock, {
          client: Object.assign(
            {
              client_id: 'clientID',
              client_secret: 'client_secret',
            },
            validIdentityProviderMock.client,
          ),
        }),
      ];

      service['decryptClientSecret'] = jest
        .fn()
        .mockReturnValueOnce(expected[0].client.client_secret);

      configMock.get.mockReturnValueOnce({
        fqdn: 'core-fcp-high.docker.dev-franceconnect.fr',
      });

      // When
      const result = await service.getList();

      // Then
      expect(result).toEqual(expected);
    });

    it('should call findAll method if refreshCache is true', async () => {
      // Given
      const refresh = true;
      const listMock = [
        {
          client_id: 'foo',
        },
        {
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
      service['listCache'] = [
        {
          client: {
            client_id: 'foo',
          },
        } as IdentityProviderMetadata,
        {
          client: {
            client_id: 'bar',
          },
        } as IdentityProviderMetadata,
      ];
      service['findAllIdentityProvider'] = jest.fn();
      // When
      const result = await service.getList();
      // Then
      expect(result).toBe(service['listCache']);
      expect(service['findAllIdentityProvider']).toHaveBeenCalledTimes(0);
    });
  });

  describe('getFilteredList', () => {
    const defaultProvidersMock = [
      {
        eidas: 1,
        name: 'idp1',
        uid: 'idp1',
      },
      {
        eidas: 1,
        name: 'idp2',
        uid: 'idp2',
      },
    ];

    beforeEach(() => {
      service.getList = jest.fn().mockResolvedValueOnce(defaultProvidersMock);
    });

    it('should return a list of mapped providers containing blacklist that we want to display', async () => {
      // GIVEN
      const idpListMock = ['idp1'];
      const blacklistMock = true;
      const showExcludedIdpMock = true;
      const expected = [
        {
          active: false,
          eidas: 1,
          name: 'idp1',
          uid: 'idp1',
        },
        {
          eidas: 1,
          name: 'idp2',
          uid: 'idp2',
        },
      ];

      service['updateProviderStatus'] = jest
        .fn()
        .mockReturnValueOnce({
          active: false,
          eidas: 1,
          name: 'idp1',
          uid: 'idp1',
        })
        .mockReturnValueOnce({
          eidas: 1,
          name: 'idp2',
          uid: 'idp2',
        });

      // WHEN
      const result = await service.getFilteredList(
        idpListMock,
        blacklistMock,
        showExcludedIdpMock,
      );

      // THEN
      expect(result).toEqual(expected);
    });

    it('should return a list of providers containing whitelisted ones and not displaying blacklist', async () => {
      // GIVEN
      const idpListMock = ['idp2'];
      const blacklistMock = false;
      const showExcludedIdpMock = false;
      const expected = [
        {
          active: false,
          display: false,
          eidas: 1,
          name: 'idp1',
          uid: 'idp1',
        },
        {
          eidas: 1,
          name: 'idp2',
          uid: 'idp2',
        },
      ];

      service['updateProviderStatus'] = jest
        .fn()
        .mockReturnValueOnce({
          active: false,
          display: false,
          eidas: 1,
          name: 'idp1',
          uid: 'idp1',
        })
        .mockReturnValueOnce({
          eidas: 1,
          name: 'idp2',
          uid: 'idp2',
        });

      // WHEN
      const result = await service.getFilteredList(
        idpListMock,
        blacklistMock,
        showExcludedIdpMock,
      );

      // THEN
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
    it('should get clientSecretEncryptKey and decryptClientSecretFeature from config', () => {
      // Given
      const clientSecretMock = 'some string';
      const decryptClientSecretFeature = false;
      const clientSecretEncryptKey = 'Key';
      configMock.get.mockReturnValueOnce({
        clientSecretEncryptKey,
        decryptClientSecretFeature,
      });

      // When
      service['decryptClientSecret'](clientSecretMock);
      // Then
      expect(configMock.get).toHaveBeenCalledTimes(1);
    });

    it('should return null if decryptClientSecretFeature is false', () => {
      // Given
      const clientSecretMock = 'some string';
      const decryptClientSecretFeature = false;
      const clientSecretEncryptKey = 'Key';
      configMock.get.mockReturnValue({
        clientSecretEncryptKey,
        decryptClientSecretFeature,
      });
      cryptographyMock.decrypt.mockReturnValue('totoIsDecrypted');

      // When
      const result = service['decryptClientSecret'](clientSecretMock);
      // Then
      expect(result).toEqual(null);
    });

    it('should call decrypt with enc key from config if decryptClientSecretFeature is true', () => {
      // Given
      const clientSecretMock = 'some string';
      const decryptClientSecretFeature = true;
      const clientSecretEncryptKey = 'Key';
      configMock.get.mockReturnValue({
        clientSecretEncryptKey,
        decryptClientSecretFeature,
      });
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

    it('should return clientSecretEncryptKey if decryptClientSecretFeature is true', () => {
      // Given
      const clientSecretMock = 'some string';
      const decryptClientSecretFeature = true;
      const clientSecretEncryptKey = 'Key';
      configMock.get.mockReturnValue({
        clientSecretEncryptKey,
        decryptClientSecretFeature,
      });
      cryptographyMock.decrypt.mockReturnValue('totoIsDecrypted');

      // When
      const result = service['decryptClientSecret'](clientSecretMock);
      // Then
      expect(result).toEqual('totoIsDecrypted');
    });
  });

  describe('getIdentityProviderDTO', () => {
    it('should return discovery identity provider DTO', () => {
      // Given
      const discovery = true;

      // When
      const result = service['getIdentityProviderDTO'](discovery);
      // Then
      expect(result).toBe(DiscoveryIdpAdapterMongoDTO);
    });

    it('should return identity provider DTO', () => {
      // Given
      const discovery = false;

      // When
      const result = service['getIdentityProviderDTO'](discovery);
      // Then
      expect(result).toBe(NoDiscoveryIdpAdapterMongoDTO);
    });
  });

  describe('isActiveById()', () => {
    it('should return true if idp is active', async () => {
      // Given
      service['getById'] = jest
        .fn()
        .mockResolvedValue(validIdentityProviderMock);
      // When
      const result = await service.isActiveById('id');
      // Then
      expect(result).toBeTrue();
    });

    it('should return false if idp is disabled', async () => {
      // Given
      service['getById'] = jest
        .fn()
        .mockResolvedValue({ ...validIdentityProviderMock, active: false });
      // When
      const result = await service.isActiveById('id');
      // Then
      expect(result).toBeFalse();
    });

    it('should return false if idp is not found', async () => {
      // Given
      const { active: _active, ...idpWithoutActiveKeyMock } =
        validIdentityProviderMock;
      service['getById'] = jest.fn().mockResolvedValue(idpWithoutActiveKeyMock);
      // When
      const result = await service.isActiveById('id');
      // Then
      expect(result).toBeFalse();
    });
  });

  describe('updateProviderStatus', () => {
    const defaultProvidersMock = {
      eidas: 1,
      name: 'idp1',
      uid: 'idp1',
    } as unknown as IdentityProviderMetadata;

    it('should return provider without modification', () => {
      // Given
      const isIdpAuthorizedMock = true;
      const showExcludedIdpMock = false;
      const expected = {
        eidas: 1,
        name: 'idp1',
        uid: 'idp1',
      };

      // When
      const result = service['updateProviderStatus'](
        defaultProvidersMock,
        isIdpAuthorizedMock,
        showExcludedIdpMock,
      );

      // When
      expect(result).toEqual(expected);
    });

    it('should return a blacklisted provider that we want to display', () => {
      // Given
      const isIdpAuthorizedMock = false;
      const showExcludedIdpMock = true;
      const expected = {
        active: false,
        eidas: 1,
        name: 'idp1',
        uid: 'idp1',
      };

      // When
      const result = service['updateProviderStatus'](
        defaultProvidersMock,
        isIdpAuthorizedMock,
        showExcludedIdpMock,
      );

      // When
      expect(result).toEqual(expected);
    });

    it("Should return a blacklisted provider that we don't want to display", () => {
      // Given
      const isIdpAuthorizedMock = false;
      const showExcludedIdpMock = false;
      const expected = {
        active: false,
        display: false,
        eidas: 1,
        name: 'idp1',
        uid: 'idp1',
      };

      // When
      const result = service['updateProviderStatus'](
        defaultProvidersMock,
        isIdpAuthorizedMock,
        showExcludedIdpMock,
      );

      // When
      expect(result).toEqual(expected);
    });
  });
});
