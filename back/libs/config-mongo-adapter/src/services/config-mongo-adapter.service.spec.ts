import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { ConfigMessageDto } from '@fc/csmr-config-client';
import {
  OidcClientLegacyInterface,
  ServiceProviderService,
} from '@fc/service-provider';

import { getConfigMock } from '@mocks/config';

import { ConfigMongoAdapterService } from './config-mongo-adapter.service';

describe('ConfigMongoAdapterService', () => {
  let service: ConfigMongoAdapterService;

  const configMock = getConfigMock();
  const cryptographyMock = {
    encryptSymetric: jest.fn(),
  };

  const serviceProviderModel = getModelToken('ServiceProvider');

  const messageMock = {
    payload: {
      client_id: 'key',
      client_secret: 'client_secret',
    },
  } as unknown as ConfigMessageDto;

  const legacyFormatted = {
    key: 'key',
    client_secret: 'client_secret',
  };

  const encryptedSecret = 'encryptedSecret';

  const modelMock = {
    findOneAndUpdate: jest.fn(),
  };

  const objectIdMock = Symbol('objectId');

  const serviceProviderMock = {
    toLegacy: jest.fn(),
  };

  const patchedData = {
    ...legacyFormatted,
    someData: 'someData',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigMongoAdapterService,
        ConfigService,
        CryptographyService,
        {
          provide: serviceProviderModel,
          useValue: modelMock,
        },
        ServiceProviderService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyMock)
      .overrideProvider(ServiceProviderService)
      .useValue(serviceProviderMock)
      .compile();

    service = module.get<ConfigMongoAdapterService>(ConfigMongoAdapterService);

    modelMock.findOneAndUpdate.mockResolvedValue({ id: objectIdMock });
    serviceProviderMock.toLegacy.mockReturnValue(legacyFormatted);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should forward call to save() method', async () => {
      // Given
      const saveResult = Symbol('saveResult');

      service['save'] = jest.fn().mockResolvedValueOnce(saveResult);

      // When
      const result = await service.create(messageMock);

      // Then
      expect(result).toBe(saveResult);
    });
  });

  describe('update', () => {
    it('should forward call to save() method', async () => {
      // Given
      const saveResult = Symbol('saveResult');

      service['save'] = jest.fn().mockResolvedValueOnce(saveResult);

      // When
      const result = await service.update(messageMock);

      // Then
      expect(result).toBe(saveResult);
    });
  });

  describe('save', () => {
    beforeEach(() => {
      service['encryptClientSecret'] = jest
        .fn()
        .mockReturnValue(encryptedSecret);
      service['patchPartnerForMongo'] = jest.fn().mockReturnValue(patchedData);
    });

    it('should encrypt client secret', async () => {
      // When
      await service['save'](messageMock);

      // Then
      expect(service['encryptClientSecret']).toHaveBeenCalledExactlyOnceWith(
        messageMock.payload.client_secret,
      );
    });

    it('should save model', async () => {
      // WHen
      await service['save'](messageMock);

      // Then
      expect(modelMock.findOneAndUpdate).toHaveBeenCalledWith(
        { key: messageMock.payload.client_id },
        {
          ...patchedData,
          client_secret: encryptedSecret,
        },
        { upsert: true, new: true },
      );
    });

    it('should return object id', async () => {
      // When
      const result = await service['save'](messageMock);

      // Then
      expect(result).toBe(objectIdMock);
    });
  });

  describe('encryptClientSecret', () => {
    const clientSecret = 'clientSecret';
    const clientSecretEncryptKey = 'clientSecretEncryptKey';
    const encryptedClientSecret = 'encryptedClientSecret';

    beforeEach(() => {
      configMock.get.mockReturnValue({ clientSecretEncryptKey });
      cryptographyMock.encryptSymetric.mockReturnValue(encryptedClientSecret);
    });

    it('should fetch configured key', () => {
      // When
      service['encryptClientSecret'](clientSecret);

      // Then
      expect(configMock.get).toHaveBeenCalledExactlyOnceWith(
        'ServiceProviderAdapterMongo',
      );
    });

    it('should encrypt client secret with configured key', () => {
      // When
      service['encryptClientSecret'](clientSecret);

      // Then
      expect(cryptographyMock.encryptSymetric).toHaveBeenCalledExactlyOnceWith(
        clientSecretEncryptKey,
        clientSecret,
      );
    });

    it('should return encrypted client_secret', () => {
      // When
      const result = service['encryptClientSecret'](clientSecret);

      // Then
      expect(result).toBe(encryptedClientSecret);
    });
  });

  describe('patchPartnerForMongo', () => {
    it('should set entityId to provided entityId', () => {
      // Given
      const input = {
        entityId: 'entityId',
        key: 'key',
      };

      // When
      const result = service['patchPartnerForMongo'](input);

      // Then
      expect(result.entityId).toBe(input.entityId);
    });

    it('should set entityId to key if entityId is not provided', () => {
      // Given
      const input = {
        key: 'key',
      };

      // When
      const result = service['patchPartnerForMongo'](input);

      // Then
      expect(result.entityId).toBe(input.key);
    });

    it('should set title to provided title', () => {
      // Given
      const input = {
        title: 'title',
        name: 'name',
      };

      // When
      const result = service['patchPartnerForMongo'](input);

      // Then
      expect(result.title).toBe(input.title);
    });

    it('should set title to name if title is not provided', () => {
      // Given
      const input = {
        name: 'name',
      };

      // When
      const result = service['patchPartnerForMongo'](input);

      // Then
      expect(result.title).toBe(input.name);
    });

    it('should set userinfo_signed_response_alg to id_token_signed_response_alg', () => {
      // Given
      const input = {
        id_token_signed_response_alg: 'id_token_signed_response_alg',
      };

      // When
      const result = service['patchPartnerForMongo'](input);

      // Then
      expect(result.userinfo_signed_response_alg).toBe(
        input.id_token_signed_response_alg,
      );
    });

    it('should cast redirect_uris, post_logout_redirect_uris and site to array', () => {
      // Given
      service['castStringToArray'] = jest.fn();
      const input = {
        redirect_uris: 'redirect_uris',
        post_logout_redirect_uris: 'post_logout_redirect_uris',
        site: 'site',
      } as unknown as Partial<OidcClientLegacyInterface>;

      // When
      service['patchPartnerForMongo'](input);

      // Then
      expect(service['castStringToArray']).toHaveBeenCalledTimes(3);
      expect(service['castStringToArray']).toHaveBeenNthCalledWith(
        1,
        input,
        'redirect_uris',
      );
      expect(service['castStringToArray']).toHaveBeenNthCalledWith(
        2,
        input,
        'post_logout_redirect_uris',
      );
      expect(service['castStringToArray']).toHaveBeenNthCalledWith(
        3,
        input,
        'site',
      );
    });
  });

  describe('castStringToArray', () => {
    it('should cast string to array', () => {
      // Given
      const input = {
        site: 'bar',
      } as unknown as Partial<OidcClientLegacyInterface>;

      // When
      service['castStringToArray'](input, 'site');

      // Then
      expect(input.site).toEqual(['bar']);
    });

    it('should not wrap property if it is already an array', () => {
      // Given
      const input = {
        site: ['bar'],
      } as unknown as Partial<OidcClientLegacyInterface>;

      // When
      service['castStringToArray'](input, 'site');

      // Then
      expect(input.site).toEqual(['bar']);
    });
  });
});
