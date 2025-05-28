import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { objectDiff } from '@fc/common';
import { ConfigService } from '@fc/config';
import { diffKeys } from '@fc/config-abstract-adapter';
import { CryptographyService } from '@fc/cryptography';
import { ConfigMessageDto } from '@fc/csmr-config-client';
import {
  PlatformTechnicalKeyEnum,
  ServiceProviderService,
} from '@fc/service-provider';

import { getConfigMock } from '@mocks/config';

import { ConfigMongoAdapterService } from './config-mongo-adapter.service';

jest.mock('@fc/common', () => ({
  ...jest.requireActual('@fc/common'),
  objectDiff: jest.fn(),
}));

describe('ConfigMongoAdapterService', () => {
  let service: ConfigMongoAdapterService;

  const configMock = getConfigMock();
  const cryptographyMock = {
    encryptSymetric: jest.fn(),
  };

  const diffMock = [];
  const objectDiffMock = jest.mocked(objectDiff);

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
    findOneAndReplace: jest.fn(),
    findOne: jest.fn(),
  };

  const objectIdMock = Symbol('objectId');

  const serviceProviderMock = {
    toLegacy: jest.fn(),
    fromLegacy: jest.fn(),
  };

  const patchedData = {
    ...legacyFormatted,
    someData: 'someData',
  };

  const documentMock = { id: objectIdMock, key: messageMock.payload.client_id };

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

    modelMock.findOneAndReplace.mockResolvedValue(documentMock);
    modelMock.findOne.mockResolvedValue(documentMock);
    serviceProviderMock.toLegacy.mockReturnValue(legacyFormatted);
    objectDiffMock.mockReturnValue(diffMock as never[]);
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
      service['getDiff'] = jest.fn().mockResolvedValue(diffMock);
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
      expect(modelMock.findOneAndReplace).toHaveBeenCalledWith(
        { key: messageMock.payload.client_id },
        {
          ...patchedData,
          client_secret: encryptedSecret,
        },
        { upsert: true, new: true },
      );
    });

    it('should return save event properties', async () => {
      // Given
      const saveEventPropertiesMock = {
        id: documentMock.key,
        diff: diffMock,
      };
      // When
      const result = await service['save'](messageMock);

      // Then
      expect(result).toEqual(saveEventPropertiesMock);
    });
  });

  describe('getDiff', () => {
    it('should call findOne with correct query', async () => {
      // Given
      const queryMock = { key: messageMock.payload.client_id };

      // When
      await service['getDiff'](messageMock);

      // Then
      expect(modelMock.findOne).toHaveBeenCalledExactlyOnceWith(queryMock);
    });

    it('should return all keys of payload if old document is not found', async () => {
      // Given
      const oldDocument = null;
      modelMock.findOne.mockResolvedValueOnce(oldDocument);

      // When
      const result = await service['getDiff'](messageMock);

      // Then
      expect(result).toEqual(Object.keys(messageMock.payload) as diffKeys);
    });

    it('should return diff of payload and old document', async () => {
      // Given
      const oldDocument = { key: 'oldKey' };
      const oldDocumentFromLegacy = {
        client_id: 'oldKey',
      };
      modelMock.findOne.mockResolvedValueOnce(oldDocument);
      service['serviceProvider'].fromLegacy = jest
        .fn()
        .mockReturnValue(oldDocumentFromLegacy);

      // When
      await service['getDiff'](messageMock);

      // Then
      expect(objectDiffMock).toHaveBeenCalledWith(
        oldDocumentFromLegacy,
        messageMock.payload,
      );
    });
  });

  describe('findOneSpByQuery', () => {
    // Given
    const clientId = Symbol('clientId');
    const signupId = Symbol('signupId');
    const queryMock = {
      platform: PlatformTechnicalKeyEnum.CORE_FCP,
      $or: [{ signup_id: signupId }, { entityId: clientId }],
    };

    it('should call findOne with correct query', async () => {
      // When
      await service.findOneSpByQuery(queryMock);

      // Then
      expect(modelMock.findOne).toHaveBeenCalledExactlyOnceWith(queryMock);
    });

    it('should return document', async () => {
      // When
      const result = await service.findOneSpByQuery(queryMock);

      // Then
      expect(result).toBe(documentMock);
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
  });
});
