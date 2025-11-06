import { ValidationError } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger';
import { MongooseChangeStreamService } from '@fc/mongoose-change-stream';
import { ServiceProviderMetadata } from '@fc/oidc';

import { getLoggerMock } from '@mocks/logger';

import { ServiceProvider } from '../schemas';
import { ServiceProviderAdapterMongoService } from './service-provider-adapter-mongo.service';

jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
  validateDto: jest.fn(),
}));

describe('ServiceProviderAdapterMongoService', () => {
  let service: ServiceProviderAdapterMongoService;

  const validServiceProviderMock = {
    key: '987654321987654321987654321987654',
    entityId: '123456789101112131415161718192021',
    active: true,
    name: 'foo',
    title: 'title',
    client_secret: "This is an encrypted string, don't ask !",
    scopes: ['openid', 'profile'],
    claims: [],
    redirect_uris: ['https://sp-site.fr/redirect_uris'],
    post_logout_redirect_uris: ['https://sp-site.fr/post_logout_redirect_uris'],
    sector_identifier_uri: 'https://sp-site.fr/sector_identifier_uri',
    id_token_signed_response_alg: 'ES256',
    id_token_encrypted_response_alg: 'RS256',
    id_token_encrypted_response_enc: 'AES256GCM',
    userinfo_encrypted_response_alg: 'RS256',
    userinfo_encrypted_response_enc: 'AES256GCM',
    userinfo_signed_response_alg: 'ES256',
    jwks_uri: 'https://sp-site.fr/jwks-uri',
    idpFilterExclude: true,
    idpFilterList: [],
    type: 'public',
    identityConsent: false,
    signup_id: '1337',
  };

  const invalidServiceProviderMock = {
    ...validServiceProviderMock,
    active: 'NOT_A_BOOLEAN',
  };

  const serviceProviderListMock = [validServiceProviderMock];

  const loggerMock = getLoggerMock();

  const cryptographyMock = {
    decrypt: jest.fn(),
  };

  const repositoryMock = {
    find: jest.fn(),
    lean: jest.fn(),
    watch: jest.fn(),
  };

  const eventBusMock: object = {
    publish: jest.fn(),
  };

  const changeStreamServiceMock = {
    registerWatcher: jest.fn(),
  };

  const serviceProviderModel = getModelToken(ServiceProvider.name);

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
        ServiceProviderAdapterMongoService,
        {
          provide: serviceProviderModel,
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

    service = module.get<ServiceProviderAdapterMongoService>(
      ServiceProviderAdapterMongoService,
    );

    repositoryMock.find.mockReturnValueOnce(repositoryMock);
    repositoryMock.lean.mockResolvedValueOnce(serviceProviderListMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    beforeEach(() => {
      service.init = jest.fn();
      configMock.get.mockReturnValue({
        disableAutoLoading: false,
      });
    });

    it('should not init if the feature flag is off', async () => {
      // Given
      configMock.get.mockReturnValueOnce({
        disableAutoLoading: true,
      });

      // When
      await service.onModuleInit();

      // Then
      expect(service.init).not.toHaveBeenCalled();
    });

    it('should init if the feature flag is on', async () => {
      // Given
      configMock.get.mockReturnValueOnce({
        disableAutoLoading: false,
      });

      // When
      await service.onModuleInit();

      // Then
      expect(service.init).toHaveBeenCalledOnce();
    });
  });

  describe('init', () => {
    beforeEach(() => {
      service.getList = jest.fn();
    });

    it('should call registerWatcher method', async () => {
      // When
      await service.init();

      // Then
      expect(changeStreamServiceMock.registerWatcher).toHaveBeenCalledWith(
        repositoryMock,
        expect.any(Function),
      );
    });

    it('should call getList method', async () => {
      // When
      await service.init();

      // Then
      expect(service.getList).toHaveBeenCalledOnce();
    });
  });

  describe('refreshCache', () => {
    beforeEach(() => {
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
    it('should return service provider with change legacy property name by openid property name', () => {
      // Given
      const expected = {
        ...validServiceProviderMock,
        client_id: validServiceProviderMock.key,
        client_secret: 'client_secret',
        scope: validServiceProviderMock.scopes.join(' '),
        signupId: '1337',
      };
      delete expected.key;
      delete expected.scopes;
      delete expected.signup_id;
      service['decryptClientSecret'] = jest
        .fn()
        .mockReturnValueOnce(expected.client_secret);

      // When
      const result = service['legacyToOpenIdPropertyName'](
        validServiceProviderMock as unknown as ServiceProvider,
      );

      // Then
      expect(result).toStrictEqual(expected);
    });
  });

  describe('findAllServiceProvider', () => {
    const platformMock = 'CORE_FCP';
    const expectedRetreivedFields = {
      _id: false,
      active: true,
      claims: true,
      client_secret: true,
      entityId: true,
      id_token_encrypted_response_alg: true,
      id_token_encrypted_response_enc: true,
      id_token_signed_response_alg: true,
      identityConsent: true,
      idpFilterExclude: true,
      idpFilterList: true,
      jwks_uri: true,
      key: true,
      name: true,
      platform: true,
      post_logout_redirect_uris: true,
      redirect_uris: true,
      sector_identifier_uri: true,
      scopes: true,
      title: true,
      type: true,
      userinfo_encrypted_response_alg: true,
      userinfo_encrypted_response_enc: true,
      userinfo_signed_response_alg: true,
      rep_scope: true,
      signup_id: true,
    };

    const validateDtoMock = jest.mocked(validateDto);

    beforeEach(() => {
      configMock.get.mockReturnValue({
        platform: platformMock,
        isLocalhostAllowed: false,
      });

      validateDtoMock.mockResolvedValueOnce([]);
    });

    it('should retrieve platform from config', async () => {
      // When
      await service['findAllServiceProvider']();

      // Then
      expect(configMock.get).toHaveBeenCalledTimes(1);
      expect(configMock.get).toHaveBeenCalledWith(
        'ServiceProviderAdapterMongo',
      );
    });

    it('should have called find once', async () => {
      // When
      await service['findAllServiceProvider']();

      // Then
      expect(repositoryMock.find).toHaveBeenCalledTimes(1);
    });

    it('should have called find with a filter argument containing active true and platform being CORE_FCP', async () => {
      // Given
      const expectedRequestFilter = {
        active: true,
        platform: platformMock,
      };
      // When
      await service['findAllServiceProvider']();

      // Then
      expect(repositoryMock.find).toHaveBeenCalledWith(
        expectedRequestFilter,
        expectedRetreivedFields,
      );
    });

    it('should have called find with a filter argument containing active true and without platform argument', async () => {
      // Given
      configMock.get.mockReset().mockReturnValue({ platform: undefined });
      const expectedRequestFilter = {
        active: true,
      };
      // When
      await service['findAllServiceProvider']();

      // Then
      expect(repositoryMock.find).toHaveBeenCalledWith(
        expectedRequestFilter,
        expectedRetreivedFields,
      );
    });

    it('should return result of type list', async () => {
      // When
      const result = await service['findAllServiceProvider']();

      // Then
      expect(result).toStrictEqual(serviceProviderListMock);
    });

    it('should log a warning if an entry is excluded by the DTO', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([
        new Error('Unknown Error') as unknown as ValidationError,
      ]);

      const invalidServiceProviderListMock = [
        validServiceProviderMock,
        invalidServiceProviderMock,
      ];

      repositoryMock.lean = jest
        .fn()
        .mockResolvedValueOnce(invalidServiceProviderListMock);

      // When
      await service['findAllServiceProvider']();

      // Then
      expect(loggerMock.alert).toHaveBeenCalledTimes(1);
    });

    it('should filter out any entry excluded by the DTO', async () => {
      // Given
      validateDtoMock.mockResolvedValueOnce([
        new Error('Unknown Error') as unknown as ValidationError,
      ]);

      const invalidServiceProviderListMock = [
        validServiceProviderMock,
        invalidServiceProviderMock,
      ];

      repositoryMock.lean = jest
        .fn()
        .mockResolvedValueOnce(invalidServiceProviderListMock);

      // When
      const result = await service['findAllServiceProvider']();

      // Then
      expect(result).toEqual(serviceProviderListMock);
    });
  });

  describe('getList', () => {
    beforeEach(() => {
      service['findAllServiceProvider'] = jest
        .fn()
        .mockResolvedValueOnce(serviceProviderListMock);
    });

    it('should resolve', async () => {
      // Given
      const legacyToOpenIdMock = jest.spyOn<
        ServiceProviderAdapterMongoService,
        any
      >(service, 'legacyToOpenIdPropertyName');
      legacyToOpenIdMock.mockImplementationOnce((data) => data);

      // When
      const result = service.getList(true);

      // Then
      expect(result).toBeInstanceOf(Promise);

      await result;
    });

    it('should return service provider list refreshed (refresh forced)', async () => {
      const expected = [
        {
          ...validServiceProviderMock,
          client_id: '987654321987654321987654321987654',
          client_secret: 'client_secret',
          scope: 'openid profile',
          signupId: '1337',
        },
      ];
      delete expected[0].key;
      delete expected[0].scopes;
      delete expected[0].signup_id;
      service['decryptClientSecret'] = jest
        .fn()
        .mockReturnValueOnce(expected[0].client_secret);

      // When
      const result = await service.getList(true);

      // Then
      expect(service['findAllServiceProvider']).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(expected);
    });

    it('should return service provider list if serviceProviderListCache is not defined', async () => {
      // Given
      service['listCache'] = [
        {
          client_id: 'foo',
        },
        {
          client_id: 'bar',
        },
      ] as unknown as ServiceProviderMetadata[];
      service['findAllServiceProvider'] = jest.fn();

      // When
      const result = await service.getList();

      // Then
      expect(result).toBe(service['listCache']);
      expect(service['findAllServiceProvider']).toHaveBeenCalledTimes(0);
    });

    it('should return service provider list with the cached version', async () => {
      const expected = [
        {
          ...validServiceProviderMock,
          client_id: '987654321987654321987654321987654',
          client_secret: 'client_secret',
          scope: 'openid profile',
          signupId: '1337',
        },
      ];
      delete expected[0].key;
      delete expected[0].scopes;
      delete expected[0].signup_id;
      service['decryptClientSecret'] = jest
        .fn()
        .mockReturnValueOnce(expected[0].client_secret);

      // When
      const result = await service.getList(true);

      // Then
      expect(service['findAllServiceProvider']).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(expected);
    });
  });

  describe('getById', () => {
    // Given
    const spListMock = [
      {
        client_id: 'wizz',
      },
      {
        client_id: 'foo',
      },
      {
        client_id: 'bar',
      },
    ];

    it('should return an existing SP', async () => {
      // Given
      const idMock = 'foo';
      service.getList = jest.fn().mockResolvedValueOnce(spListMock);
      // When
      const result = await service.getById(idMock);
      // Then
      expect(result).toEqual({
        client_id: 'foo',
      });
    });
    it('should return undefined for non existing SP', async () => {
      // Given
      const idMock = 'nope';
      service.getList = jest.fn().mockResolvedValueOnce(spListMock);
      // When
      const result = await service.getById(idMock);
      // Then
      expect(result).toBeUndefined();
    });
    it('should pass refresh flag to getList method', async () => {
      // Given
      const idMock = 'foo';
      const refresh = true;
      service.getList = jest.fn().mockResolvedValueOnce(spListMock);
      // When
      await service.getById(idMock, refresh);
      // Then
      expect(service.getList).toHaveBeenCalledTimes(1);
      expect(service.getList).toHaveBeenCalledWith(refresh);
    });
  });

  describe('shouldExcludeIdp', () => {
    // Given
    const spListMock = [
      {
        client_id: 'wizz',
        idpFilterExclude: true,
        idpFilterList: ['idp1'],
      },
      {
        client_id: 'foo',
        idpFilterExclude: false,
        idpFilterList: ['idp1'],
      },
      {
        client_id: 'bar',
        idpFilterExclude: true,
        idpFilterList: ['idp2'],
      },
    ];

    it('should return true because idp1 is blacklisted', async () => {
      // Given
      service.getById = jest.fn().mockReturnValueOnce(spListMock[0]);

      // When
      const result = await service.shouldExcludeIdp('wizz', 'idp1');

      // Then
      expect(result).toBeTruthy();
    });

    it('should return false because idp1 is whitelist', async () => {
      // Given
      service.getById = jest.fn().mockReturnValueOnce(spListMock[1]);

      // When
      const result = await service.shouldExcludeIdp('foo', 'idp1');

      // Then
      expect(result).toBeFalsy();
    });

    it('should return false because idp1 is not blacklisted', async () => {
      // Given
      service.getById = jest.fn().mockReturnValueOnce(spListMock[2]);

      //When
      const result = await service.shouldExcludeIdp('bar', 'idp1');

      // Then
      expect(result).toBeFalsy();
    });
  });

  describe('legacyToOpenIdPropertyName', () => {
    it('should return service provider with change legacy property name by openid property name', () => {
      // Given
      const expected = {
        ...validServiceProviderMock,
        client_id: '987654321987654321987654321987654',
        client_secret: 'client_secret',
        scope: 'openid profile',
        signupId: '1337',
      };
      delete expected.key;
      delete expected.scopes;
      delete expected.signup_id;
      service['decryptClientSecret'] = jest
        .fn()
        .mockReturnValueOnce('client_secret');

      // When
      const result = service['legacyToOpenIdPropertyName'](
        validServiceProviderMock as unknown as ServiceProvider,
      );

      // Then
      expect(result).toStrictEqual(expected);
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

  describe('consentRequired', () => {
    it('should return true if the service provider is private and consent required', () => {
      // Given
      const givenServiceProvider = {
        ...validServiceProviderMock,
        type: 'private',
        identityConsent: true,
      };

      // When
      const result = service.consentRequired(
        givenServiceProvider.type,
        givenServiceProvider.identityConsent,
      );

      // Then
      expect(result).toEqual(true);
    });

    it('should return false if the service provider is private and consent not required', () => {
      // Given
      const givenServiceProvider = {
        ...validServiceProviderMock,
        type: 'private',
      };

      // When
      const result = service.consentRequired(
        givenServiceProvider.type,
        givenServiceProvider.identityConsent,
      );

      // Then
      expect(result).toEqual(false);
    });

    it('should return false if the service provider is public and consent required', () => {
      // Given
      const givenServiceProvider = {
        ...validServiceProviderMock,
        identityConsent: true,
      };

      // When
      const result = service.consentRequired(
        givenServiceProvider.type,
        givenServiceProvider.identityConsent,
      );

      // Then
      expect(result).toEqual(false);
    });

    it('should return false if the service provider is public and consent not required', () => {
      // When
      const result = service.consentRequired(
        validServiceProviderMock.type,
        validServiceProviderMock.identityConsent,
      );

      // Then
      expect(result).toEqual(false);
    });
  });
});
