import { Test, TestingModule } from '@nestjs/testing';

import { PartnersServiceProviderInstance } from '@entities/typeorm';

import { getTransformed } from '@fc/common';
import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { PartnersServiceProviderInstanceService } from '@fc/partners-service-provider-instance';
import { ServiceProviderInstanceVersionDto } from '@fc/partners-service-provider-instance-version';
import { ClientTypeEnum, SignatureAlgorithmEnum } from '@fc/service-provider';

import { getConfigMock } from '@mocks/config';

import { PartnersInstanceVersionFormService } from './partners-instance-version-form.service';

describe('PartnersInstanceVersionFormService', () => {
  let service: PartnersInstanceVersionFormService;

  const configServiceMock = getConfigMock();

  const generatedClientIdMock = 'generated client_id mock';
  const generatedClientSecretMock = 'generated client_secret mock';

  const credentialsBytesLengthMock = 42;
  const configDataMock = {
    active: false,
    type: ClientTypeEnum.PUBLIC,
    scopes: ['openid'],
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

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersInstanceVersionFormService,
        ConfigService,
        PartnersServiceProviderInstanceService,
        CryptographyService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(PartnersServiceProviderInstanceService)
      .useValue(instanceMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptoMock)
      .compile();

    service = module.get<PartnersInstanceVersionFormService>(
      PartnersInstanceVersionFormService,
    );

    configServiceMock.get.mockReturnValue(configDataMock);
    cryptoMock.genRandomString
      .mockReturnValueOnce(generatedClientIdMock)
      .mockReturnValueOnce(generatedClientSecretMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fromFormValues', () => {
    it('should return an object with default values from config', async () => {
      // When
      const result = await service.fromFormValues(formVersionMock);

      // Then
      expect(result).toStrictEqual(expect.objectContaining(configDataMock));
    });

    it('should return an object with generated values', async () => {
      // Given
      const generatedValues = {
        generated: 'value',
      };
      service['getGeneratedValues'] = jest
        .fn()
        .mockResolvedValueOnce(generatedValues);

      // When
      const result = await service.fromFormValues(formVersionMock);

      // Then
      expect(result).toStrictEqual(expect.objectContaining(generatedValues));
    });
  });

  describe('getGeneratedValues', () => {
    it('should return credentials for given instanceId', async () => {
      // Given
      const getCredentialsForInstanceResult = Symbol(
        'getCredentialsForInstanceResult',
      );
      service['getCredentialsForInstance'] = jest
        .fn()
        .mockResolvedValueOnce(getCredentialsForInstanceResult);

      // When
      const result = await service['getGeneratedValues']('instanceId');

      // Then
      expect(result).toBe(getCredentialsForInstanceResult);
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
      const result = await service['getGeneratedValues']();

      // Then
      expect(result).toBe(generateNewCredentialsResult);
    });
  });

  describe('getCredentialsForInstance', () => {
    it('should return an object with client_id and client_secret', async () => {
      // Given
      instanceMock.getById.mockResolvedValueOnce({
        versions: [
          {
            data: databaseVersionMock,
          },
        ],
      });

      // When
      const result = await service['getCredentialsForInstance']('instanceId');

      // Then
      expect(result).toStrictEqual({
        client_id: databaseVersionMock.client_id,
        client_secret: databaseVersionMock.client_secret,
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

  describe('toFormValues', () => {
    it('should remove private values', () => {
      // Given
      const instanceMock = {
        versions: [
          {
            data: databaseVersionMock,
          },
        ],
      } as unknown as PartnersServiceProviderInstance;

      // When
      const result = service.toFormValues(instanceMock);

      // Then
      expect(result).toEqual({
        ...instanceMock,
        versions: [
          {
            data: {
              ...formVersionMock,
              client_id: databaseVersionMock.client_id,
              client_secret: databaseVersionMock.client_secret,
              entityId: databaseVersionMock.entityId,
            },
          },
        ],
      });
    });
  });
});
