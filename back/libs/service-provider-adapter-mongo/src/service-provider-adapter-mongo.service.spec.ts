import { EventBus } from '@nestjs/cqrs';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger-legacy';
import { MongooseCollectionOperationWatcherHelper } from '@fc/mongoose';
import { ServiceProviderMetadata } from '@fc/oidc';

import { platform } from './enums';
import { ServiceProvider } from './schemas';
import { ServiceProviderAdapterMongoService } from './service-provider-adapter-mongo.service';

describe('ServiceProviderAdapterMongoService', () => {
  let service: ServiceProviderAdapterMongoService;

  const validServiceProviderMock = {
    key: '987654321987654321987654321987654',
    entityId: '123456789101112131415161718192021',
    active: true,
    name: 'foo',
    title: 'title',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    client_secret: "This is an encrypted string, don't ask !",
    scopes: ['openid', 'profile'],
    claims: [],
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    redirect_uris: ['https://sp-site.fr/redirect_uris'],
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    post_logout_redirect_uris: ['https://sp-site.fr/post_logout_redirect_uris'],
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id_token_signed_response_alg: 'ES256',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id_token_encrypted_response_alg: 'RS256',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id_token_encrypted_response_enc: 'AES256GCM',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_encrypted_response_alg: 'RS256',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_encrypted_response_enc: 'AES256GCM',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    userinfo_signed_response_alg: 'ES256',
    // oidc param name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    jwks_uri: 'https://sp-site.fr/jwks-uri',
    idpFilterExclude: true,
    idpFilterList: [],
    type: 'public',
    identityConsent: false,
    ssoDisabled: false,
  };

  const invalidServiceProviderMock = {
    ...validServiceProviderMock,
    active: 'NOT_A_BOOLEAN',
  };

  const serviceProviderListMock = [validServiceProviderMock];

  const loggerMock = {
    setContext: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  };

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

  const mongooseCollectionOperationWatcherHelperMock = {
    connectAllWatchers: jest.fn(),
    watchWith: jest.fn(),
  };

  const serviceProviderModel = getModelToken('ServiceProvider');

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
        MongooseCollectionOperationWatcherHelper,
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
      .overrideProvider(MongooseCollectionOperationWatcherHelper)
      .useValue(mongooseCollectionOperationWatcherHelperMock)
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
    it('should call watchWith from mongooseHelper', async () => {
      // When
      await service.onModuleInit();
      // Then
      expect(
        mongooseCollectionOperationWatcherHelperMock.watchWith,
      ).toHaveBeenCalledTimes(1);
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
    it('should return service provider with change legacy property name by openid property name', () => {
      // setup
      const expected = {
        ...validServiceProviderMock,
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: validServiceProviderMock.key,
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_secret: 'client_secret',
        scope: validServiceProviderMock.scopes.join(' '),
      };
      delete expected.key;
      delete expected.scopes;
      service['decryptClientSecret'] = jest
        .fn()
        .mockReturnValueOnce(expected.client_secret);

      // action
      const result = service['legacyToOpenIdPropertyName'](
        validServiceProviderMock as unknown as ServiceProvider,
      );

      // expect
      expect(result).toStrictEqual(expected);
    });
  });

  describe('findAllServiceProvider', () => {
    const { CORE_FCP } = platform;
    const expectedRetreivedFields = {
      _id: false,
      active: true,
      claims: true,
      grant_types: true ,
      response_types: true,
      // openid defined property names
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_secret: true,
      entityId: true,
      // openid defined property names
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_token_encrypted_response_alg: true,
      // openid defined property names
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_token_encrypted_response_enc: true,
      // openid defined property names
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_token_signed_response_alg: true,
      identityConsent: true,
      idpFilterExclude: true,
      idpFilterList: true,
      // openid defined property names
      // eslint-disable-next-line @typescript-eslint/naming-convention
      jwks_uri: true,
      key: true,
      name: true,
      platform: true,
      // openid defined property names
      // eslint-disable-next-line @typescript-eslint/naming-convention
      post_logout_redirect_uris: true,
      // openid defined property names
      // eslint-disable-next-line @typescript-eslint/naming-convention
      redirect_uris: true,
      scopes: true,
      ssoDisabled: true,
      title: true,
      type: true,
      // openid defined property names
      // eslint-disable-next-line @typescript-eslint/naming-convention
      userinfo_encrypted_response_alg: true,
      // openid defined property names
      // eslint-disable-next-line @typescript-eslint/naming-convention
      userinfo_encrypted_response_enc: true,
      // openid defined property names
      // eslint-disable-next-line @typescript-eslint/naming-convention
      userinfo_signed_response_alg: true,
    };

    beforeEach(() => {
      configMock.get.mockReturnValue({ platform: CORE_FCP });
    });

    it('should resolve', async () => {
      // action
      const result = service['findAllServiceProvider']();

      // expect
      expect(result).toBeInstanceOf(Promise);
    });

    it('should retrieve platform from config', async () => {
      // action
      await service['findAllServiceProvider']();

      // expect
      expect(configMock.get).toHaveBeenCalledTimes(1);
      expect(configMock.get).toHaveBeenCalledWith(
        'ServiceProviderAdapterMongo',
      );
    });

    it('should have called find once', async () => {
      // action
      await service['findAllServiceProvider']();

      // expect
      expect(repositoryMock.find).toHaveBeenCalledTimes(1);
    });

    it('should have called find with a filter argument containing active true and platform being CORE_FCP', async () => {
      // setup
      const expectedRequestFilter = {
        active: true,
        platform: CORE_FCP,
      };
      // action
      await service['findAllServiceProvider']();

      // expect
      expect(repositoryMock.find).toHaveBeenCalledWith(
        expectedRequestFilter,
        expectedRetreivedFields,
      );
    });

    it('should have called find with a filter argument containing active true and without platform argument', async () => {
      // setup
      configMock.get.mockReset().mockReturnValue({ platform: undefined });
      const expectedRequestFilter = {
        active: true,
      };
      // action
      await service['findAllServiceProvider']();

      // expect
      expect(repositoryMock.find).toHaveBeenCalledWith(
        expectedRequestFilter,
        expectedRetreivedFields,
      );
    });

    it('should return result of type list', async () => {
      // action
      const result = await service['findAllServiceProvider']();

      // expect
      expect(result).toStrictEqual(serviceProviderListMock);
    });

    it('should log a warning if an entry is excluded by the DTO', async () => {
      // setup
      const invalidServiceProviderListMock = [
        validServiceProviderMock,
        invalidServiceProviderMock,
      ];

      repositoryMock.lean = jest
        .fn()
        .mockResolvedValueOnce(invalidServiceProviderListMock);

      // action
      await service['findAllServiceProvider']();

      // expect
      expect(loggerMock.warn).toHaveBeenCalledTimes(1);
    });

    it('should filter out any entry excluded by the DTO', async () => {
      // setup
      const invalidServiceProviderListMock = [
        validServiceProviderMock,
        invalidServiceProviderMock,
      ];

      repositoryMock.lean = jest
        .fn()
        .mockResolvedValueOnce(invalidServiceProviderListMock);

      // action
      const result = await service['findAllServiceProvider']();

      // expect
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
      // setup
      const legacyToOpenIdMock = jest.spyOn<
        ServiceProviderAdapterMongoService,
        any
      >(service, 'legacyToOpenIdPropertyName');
      legacyToOpenIdMock.mockImplementationOnce((data) => data);

      // action
      const result = service.getList(true);

      // expect
      expect(result).toBeInstanceOf(Promise);

      await result;
    });

    it('should return service provider list refreshed (refresh forced)', async () => {
      const expected = [
        {
          ...validServiceProviderMock,
          // oidc param name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_id: '987654321987654321987654321987654',
          // oidc param name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_secret: 'client_secret',
          scope: 'openid profile',
        },
      ];
      delete expected[0].key;
      delete expected[0].scopes;
      service['decryptClientSecret'] = jest
        .fn()
        .mockReturnValueOnce(expected[0].client_secret);

      // action
      const result = await service.getList(true);

      // expect
      expect(service['findAllServiceProvider']).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(expected);
    });

    it('should return service provider list if serviceProviderListCache is not defined', async () => {
      // setup
      service['listCache'] = [
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
      ] as unknown as ServiceProviderMetadata[];
      service['findAllServiceProvider'] = jest.fn();

      // action
      const result = await service.getList();

      // expect
      expect(result).toBe(service['listCache']);
      expect(service['findAllServiceProvider']).toHaveBeenCalledTimes(0);
    });

    it('should return service provider list with the cached version', async () => {
      const expected = [
        {
          ...validServiceProviderMock,
          // oidc param name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_id: '987654321987654321987654321987654',
          // oidc param name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          client_secret: 'client_secret',
          scope: 'openid profile',
        },
      ];
      delete expected[0].key;
      delete expected[0].scopes;
      service['decryptClientSecret'] = jest
        .fn()
        .mockReturnValueOnce(expected[0].client_secret);

      // action
      const result = await service.getList(true);

      // expect
      expect(service['findAllServiceProvider']).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(expected);
    });
  });

  describe('getById', () => {
    // Given
    const spListMock = [
      {
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: 'wizz',
      },
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

    it('should return an existing SP', async () => {
      // Given
      const idMock = 'foo';
      service.getList = jest.fn().mockResolvedValueOnce(spListMock);
      // When
      const result = await service.getById(idMock);
      // Then
      expect(result).toEqual({
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
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
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: 'wizz',
        idpFilterExclude: true,
        idpFilterList: ['idp1'],
      },
      {
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: 'foo',
        idpFilterExclude: false,
        idpFilterList: ['idp1'],
      },
      {
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: 'bar',
        idpFilterExclude: true,
        idpFilterList: ['idp2'],
      },
    ];

    it('Should return true because idp1 is blacklisted', async () => {
      // setup
      service.getById = jest.fn().mockReturnValueOnce(spListMock[0]);

      // action
      const result = await service.shouldExcludeIdp('wizz', 'idp1');

      // expect
      expect(result).toBeTruthy();
    });

    it('Should return false because idp1 is whitelist', async () => {
      // setup
      service.getById = jest.fn().mockReturnValueOnce(spListMock[1]);

      // action
      const result = await service.shouldExcludeIdp('foo', 'idp1');

      // expect
      expect(result).toBeFalsy();
    });

    it('Should return false because idp1 is not blacklisted', async () => {
      // setup
      service.getById = jest.fn().mockReturnValueOnce(spListMock[2]);

      //action
      const result = await service.shouldExcludeIdp('bar', 'idp1');

      // expect
      expect(result).toBeFalsy();
    });
  });

  describe('legacyToOpenIdPropertyName', () => {
    it('should return service provider with change legacy property name by openid property name', () => {
      // setup
      const expected = {
        ...validServiceProviderMock,
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_id: '987654321987654321987654321987654',
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        client_secret: 'client_secret',
        scope: 'openid profile',
      };
      delete expected.key;
      delete expected.scopes;
      service['decryptClientSecret'] = jest
        .fn()
        .mockReturnValueOnce('client_secret');

      // action
      const result = service['legacyToOpenIdPropertyName'](
        validServiceProviderMock as unknown as ServiceProvider,
      );

      // expect
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
