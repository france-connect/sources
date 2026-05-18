import { Test, TestingModule } from '@nestjs/testing';

import { PartnersServiceProviderInstance } from '@entities/typeorm';

import { getTransformed } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { PartnersServiceProviderService } from '@fc/partners-service-provider';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import { ServiceProviderInstanceVersionDto } from '@fc/partners-service-provider-instance-version';
import { ClientTypeEnum, SignatureAlgorithmEnum } from '@fc/service-provider';

import { getConfigMock } from '@mocks/config';

import { PartnersInstanceVersionFormService } from './partners-instance-version-form.service';
import { PartnersServiceProviderFormService } from './partners-service-provider-form.service';

describe('PartnersInstanceVersionFormService', () => {
  let service: PartnersInstanceVersionFormService;

  const configServiceMock = getConfigMock();

  const generatedClientIdMock = 'generated client_id mock';
  const generatedClientSecretMock = 'generated client_secret mock';

  const credentialsBytesLengthMock = 42;
  const configDataMock = {
    active: false,
    type: ClientTypeEnum.PUBLIC,
    scope: ['dgfip_foo', 'cnam_bar'],
    claims: [],
    rep_scope: [],
    idpFilterExclude: true,
    idpFilterList: [],
    identityConsent: false,
    credentialsBytesLength: credentialsBytesLengthMock,
  };

  const databaseVersionMock = {
    name: 'instance name',
    entityId: 'entityId from database',
    client_id: 'clientIdMock from database',
    client_secret: 'clientSecretMock from database',
    signupId: '123456',
    id_token_signed_response_alg: SignatureAlgorithmEnum.ES256,
    site: ['https://site.fr'],
    redirect_uris: ['https://site.fr/callback'],
    post_logout_redirect_uris: ['https://site.fr/logout'],
    IPServerAddressesAndRanges: [],
    ...configDataMock,
  } as unknown as ServiceProviderInstanceVersionDto;

  const formVersionMock = getTransformed(
    {
      name: 'instance name',
      entityId: 'entityId from form',
      client_id: 'clientIdMock from form',
      client_secret: 'clientSecretMock from form',
      signupId: '123456',
      id_token_signed_response_alg: SignatureAlgorithmEnum.ES256,
      site: ['https://site.fr'],
      redirect_uris: ['https://site.fr/callback'],
      post_logout_redirect_uris: ['https://site.fr/logout'],
      IPServerAddressesAndRanges: [],
    },
    ServiceProviderInstanceVersionDto,
  ) as unknown as ServiceProviderInstanceVersionDto;

  const cryptoMock = {
    genRandomString: jest.fn(),
  };

  const instanceMock = {
    getById: jest.fn(),
  };

  const serviceProviderServiceMock = {
    getById: jest.fn(),
  };

  const serviceProviderMock = {
    id: 'service-provider-id',
    name: 'Test Service Provider',
    datapassRequestId: '12345',
    datapassScopes: ['openid', 'given_name'],
    platform: null,
    organization: null,
  };

  const serviceProviderFormServiceMock = {
    toDisplayValue: jest.fn(),
  };

  const spDisplayValueMock = {
    fcScopes: ['openid', 'given_name'],
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersInstanceVersionFormService,
        ConfigService,
        PartnersServiceProviderInstanceService,
        CryptographyService,
        PartnersServiceProviderService,
        PartnersServiceProviderFormService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(PartnersServiceProviderInstanceService)
      .useValue(instanceMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptoMock)
      .overrideProvider(PartnersServiceProviderService)
      .useValue(serviceProviderServiceMock)
      .overrideProvider(PartnersServiceProviderFormService)
      .useValue(serviceProviderFormServiceMock)
      .compile();

    service = module.get<PartnersInstanceVersionFormService>(
      PartnersInstanceVersionFormService,
    );

    configServiceMock.get.mockReturnValue(configDataMock);
    cryptoMock.genRandomString
      .mockReturnValueOnce(generatedClientIdMock)
      .mockReturnValueOnce(generatedClientSecretMock);

    serviceProviderServiceMock.getById.mockResolvedValue(serviceProviderMock);
    serviceProviderFormServiceMock.toDisplayValue.mockReturnValue(
      spDisplayValueMock,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fromFormValues', () => {
    const getOrGenerateValuesMock = {
      mutable: { generated: 'value' },
      immutable: {
        client_id: generatedClientIdMock,
        client_secret: generatedClientSecretMock,
      },
    };

    const getScopesForServiceProviderMock = ['openid', 'given_name'];
    beforeEach(() => {
      service['getOrGenerateValues'] = jest
        .fn()
        .mockResolvedValueOnce(getOrGenerateValuesMock);
      service['getScopesForServiceProvider'] = jest
        .fn()
        .mockResolvedValueOnce(getScopesForServiceProviderMock);
    });

    it('should return an object with expected values', async () => {
      // When
      const result = await service.fromFormValues(
        formVersionMock,
        serviceProviderMock.id,
      );

      // Then
      expect(result).toStrictEqual(
        expect.objectContaining({
          ...configDataMock,
          ...getOrGenerateValuesMock.mutable,
          ...formVersionMock,
          ...getOrGenerateValuesMock.immutable,
          scope: getScopesForServiceProviderMock,
        }),
      );
    });
  });

  describe('getOrGenerateValues', () => {
    it('should return credentials for given instanceId', async () => {
      // Given
      const getLatestVersionForInstanceResult = Symbol(
        'getLatestVersionForInstanceResult',
      );
      service['getLatestVersionForInstance'] = jest
        .fn()
        .mockResolvedValueOnce(getLatestVersionForInstanceResult);

      // When
      const result = await service['getOrGenerateValues']('instanceId');

      // Then
      expect(result).toBe(getLatestVersionForInstanceResult);
    });

    it('should return generated credentials', async () => {
      // Given
      const generateNewCredentialsResult = Symbol(
        'generateNewCredentialsResult',
      );
      service['generateNewCredentials'] = jest
        .fn()
        .mockReturnValueOnce(generateNewCredentialsResult);

      // When
      const result = await service['getOrGenerateValues']();

      // Then
      expect(result).toStrictEqual({
        immutable: generateNewCredentialsResult,
        mutable: {},
      });
    });
  });

  describe('getLatestVersionForInstance', () => {
    it('should return an object with client_id and client_secret', async () => {
      // Given
      instanceMock.getById.mockResolvedValueOnce({
        currentVersion: {
          data: databaseVersionMock,
        },
      });

      // When
      const result = await service['getLatestVersionForInstance']('instanceId');

      // Then
      expect(result).toStrictEqual({
        immutable: {
          client_id: databaseVersionMock.client_id,
          client_secret: databaseVersionMock.client_secret,
          idpFilterExclude: true,
        },
        mutable: databaseVersionMock,
      });
    });
  });

  describe('generateNewCredentials', () => {
    it('should use length from config to generate random strings', () => {
      // When
      service['generateNewCredentials']();

      // Then
      expect(cryptoMock.genRandomString).toHaveBeenCalledTimes(2);
      expect(cryptoMock.genRandomString).toHaveBeenNthCalledWith(
        1,
        credentialsBytesLengthMock,
      );
      expect(cryptoMock.genRandomString).toHaveBeenNthCalledWith(
        2,
        credentialsBytesLengthMock,
      );
    });

    it('should return an object with generated values', () => {
      // When
      const result = service['generateNewCredentials']();

      // Then
      expect(result).toStrictEqual({
        client_id: generatedClientIdMock,
        client_secret: generatedClientSecretMock,
      });
    });
  });

  describe('getScopesForServiceProvider', () => {
    it('should return mix of scopes from config and service provider', async () => {
      // Given
      serviceProviderFormServiceMock.toDisplayValue.mockReturnValue(
        spDisplayValueMock,
      );
      configServiceMock.get.mockReturnValue(configDataMock);

      // When
      const result =
        await service['getScopesForServiceProvider']('serviceProviderId');

      // Then
      expect(result).toEqual([
        ...spDisplayValueMock.fcScopes,
        ...configDataMock.scope,
      ]);
    });
  });

  describe('toFormValues', () => {
    it('should remove private values', () => {
      // Given
      const instanceMock = {
        currentVersion: {
          data: databaseVersionMock,
        },
      } as unknown as PartnersServiceProviderInstance;

      // When
      const result = service.toFormValues(instanceMock);

      // Then
      expect(result).toEqual({
        ...instanceMock,
        currentVersion: {
          data: {
            ...formVersionMock,
            client_id: databaseVersionMock.client_id,
            client_secret: databaseVersionMock.client_secret,
            entityId: databaseVersionMock.entityId,
          },
        },
      });
    });
  });
});
