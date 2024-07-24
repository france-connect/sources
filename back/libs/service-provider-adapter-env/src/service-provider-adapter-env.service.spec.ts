import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { ServiceProviderAdapterEnvService } from './service-provider-adapter-env.service';

describe('ServiceProviderService', () => {
  let service: ServiceProviderAdapterEnvService;

  const validServiceProviderMock = {
    name: 'FSA - FSA1-LOW',
    title: 'FSA - FSA1-LOW - TITLE',
    redirect_uris: [
      'https://core-fca-low.docker.dev-franceconnect.fr/api/v2/oidc-callback/fia1-low',
    ],
    post_logout_redirect_uris: [
      'https://core-fca-low.docker.dev-franceconnect.fr/logout-callback',
    ],
    client_secret: 'client_secret',
    client_id: '123',
    active: true,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __v: 4,
    updatedAt: new Date('2019-04-24 17:09:17'),
    updatedBy: 'admin',
    scope: 'openid profile',
    id_token_signed_response_alg: 'ES256',
    id_token_encrypted_response_alg: 'RSA-OAEP',
    id_token_encrypted_response_enc: 'A256GCM',
    userinfo_signed_response_alg: 'ES256',
    userinfo_encrypted_response_alg: 'RSA-OAEP',
    userinfo_encrypted_response_enc: 'A256GCM',
    jwks_uri:
      'https://core-fca-low.docker.dev-franceconnect.fr/api/v2/client/.well-known/keys',
  };

  const configMock = {
    get: jest.fn(),
  };

  const serviceProviderListMock = [validServiceProviderMock];

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceProviderAdapterEnvService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .compile();

    service = module.get<ServiceProviderAdapterEnvService>(
      ServiceProviderAdapterEnvService,
    );

    configMock.get.mockReturnValue({ list: [validServiceProviderMock] });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getList', () => {
    beforeEach(() => {
      service['findAllServiceProvider'] = jest
        .fn()
        .mockResolvedValueOnce(serviceProviderListMock);
    });

    it('should return service provider list', async () => {
      // Given
      const expected = [validServiceProviderMock];
      // When
      const result = await service.getList();
      // Then
      expect(result).toEqual(expected);
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
      service.getList = jest.fn().mockResolvedValueOnce(spListMock);
      // When
      await service.getById(idMock);
      // Then
      expect(service.getList).toHaveBeenCalledTimes(1);
    });
  });

  describe('shouldExcludeIdp', () => {
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

    it('Should return true because idp1 is blacklist', async () => {
      // Given
      service.getById = jest.fn().mockReturnValueOnce(spListMock[0]);
      // When
      const result = await service.shouldExcludeIdp('wizz', 'idp1');
      // Then
      expect(result).toBe(true);
    });

    it('Should return false because idp1 is whitelist', async () => {
      // Given
      service.getById = jest.fn().mockReturnValueOnce(spListMock[1]);
      // When
      const result = await service.shouldExcludeIdp('foo', 'idp1');
      // Then
      expect(result).toBe(false);
    });

    it('Should return false because idp1 is not blacklist', async () => {
      // Given
      service.getById = jest.fn().mockReturnValueOnce(spListMock[2]);
      // When
      const result = await service.shouldExcludeIdp('bar', 'idp1');
      // Then
      expect(result).toBe(false);
    });
  });
});
