import { lastValueFrom } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { EnvironmentEnum, PublicationStatusEnum } from '@entities/typeorm';

import { ConfigService } from '@fc/config';
import {
  ActionTypes,
  ConfigCreateMessageDtoPayload,
  CreatedVia,
} from '@fc/csmr-config-client';
import { LoggerService } from '@fc/logger';
import { ServiceProviderMetadata } from '@fc/oidc';
import { HUB_SIGN_HEADER, WebhooksService } from '@fc/webhooks';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';
import { getPublisherMock } from '@mocks/microservices-rmq';

import { WEBHOOK_NAME } from '../constants';
import { ConsolidatedDataInterface } from '../interfaces';
import { ImportService } from './import.service';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

jest.mock('rxjs');

describe('ImportService', () => {
  const loggerMock = getLoggerMock();
  const configMock = getConfigMock();
  const configSandboxLow = getPublisherMock();
  const webhooksService = {
    sign: jest.fn(),
  };
  const httpServiceMock = {
    post: jest.fn(),
  };
  const uuidMock = jest.mocked(uuid);
  const lastValueFromMock = jest.mocked(lastValueFrom);

  let service: ImportService;

  const csvDataMock = [
    { email: 'foo@bar.com', datapassId: '12345' },
    { email: 'fizz@buzz.fr', datapassId: '67890' },
  ];

  const dbDataMock: ServiceProviderMetadata[] = [
    {
      signupId: '12345',
      name: 'Service Provider 1',
      metadata: { some: 'data' },
      scope: 'openid profile email',
      active: true,
      claims: [],
      client_id: Symbol('client_id') as unknown as string,
      client_secret: Symbol('client_secret') as unknown as string,
      entityId: Symbol('entityId') as unknown as string,
      identityConsent: true,
      idpFilterExclude: true,
      idpFilterList: [],
      post_logout_redirect_uris: [],
      redirect_uris: [],
      rep_scope: [],
      sector_identifier_uri: 'https://example.com/sector-identifier',
      id_token_signed_response_alg: 'ES256',
      id_token_encrypted_response_enc: 'A128GCM',
      id_token_encrypted_response_alg: 'RSA-OAEP-256',
      userinfo_encrypted_response_alg: 'RSA-OAEP-256',
      userinfo_encrypted_response_enc: 'A128GCM',
      userinfo_signed_response_alg: 'ES256',
      platform: Symbol('platform') as unknown as EnvironmentEnum,
      type: Symbol('type') as unknown as EnvironmentEnum,
      title: Symbol('title') as unknown as string,
    },
    {
      signupId: '333333',
      name: 'Service Provider 2',
      metadata: { some: 'other data' },
      scope: 'openid profile email',
      active: true,
      claims: [],
      client_id: Symbol('client_id') as unknown as string,
      client_secret: Symbol('client_secret') as unknown as string,
      entityId: Symbol('entityId') as unknown as string,
      identityConsent: true,
      idpFilterExclude: true,
      idpFilterList: [],
      post_logout_redirect_uris: [],
      redirect_uris: [],
      rep_scope: [],
      sector_identifier_uri: 'https://example.com/sector-identifier',
      id_token_signed_response_alg: 'ES256',
      id_token_encrypted_response_enc: 'A128GCM',
      id_token_encrypted_response_alg: 'RSA-OAEP-256',
      userinfo_encrypted_response_alg: 'RSA-OAEP-256',
      userinfo_encrypted_response_enc: 'A128GCM',
      userinfo_signed_response_alg: 'ES256',
      platform: Symbol('platform') as unknown as EnvironmentEnum,
      type: Symbol('type') as unknown as EnvironmentEnum,
      title: Symbol('title') as unknown as string,
    },
  ];

  const consolidatedDataMock = [
    {
      email: 'foo@bar.com',
      sp: {
        signupId: '12345',
        name: 'Service Provider 1',
        metadata: { some: 'data' },
        scope: 'openid profile email',
        active: true,
        claims: [],
        client_id: dbDataMock[0].client_id,
        client_secret: dbDataMock[0].client_secret,
        entityId: dbDataMock[0].entityId,
        identityConsent: true,
        idpFilterExclude: true,
        idpFilterList: [],
        post_logout_redirect_uris: [],
        redirect_uris: [],
        rep_scope: [],
        sector_identifier_uri: 'https://example.com/sector-identifier',
        id_token_signed_response_alg: 'ES256',
        id_token_encrypted_response_enc: 'A128GCM',
        id_token_encrypted_response_alg: 'RSA-OAEP-256',
        userinfo_encrypted_response_alg: 'RSA-OAEP-256',
        userinfo_encrypted_response_enc: 'A128GCM',
        userinfo_signed_response_alg: 'ES256',
        platform: dbDataMock[0].platform,
        type: dbDataMock[0].type,
        title: dbDataMock[0].title,
      },
    },
  ];

  const configDataMock = {
    inviteEndpoint: 'https://example.com/invite',
    environment: EnvironmentEnum.SANDBOX,
    testInstanceId: 'instance-id',
    testEmail: 'foo@bar.com',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportService,
        ConfigService,
        LoggerService,
        {
          provide: 'ConfigSandboxLow',
          useValue: configSandboxLow,
        },
        HttpService,
        WebhooksService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(HttpService)
      .useValue(httpServiceMock)
      .overrideProvider(WebhooksService)
      .useValue(webhooksService)

      .compile();

    service = module.get<ImportService>(ImportService);

    configMock.get.mockReturnValue(configDataMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('diagnostic', () => {
    beforeEach(() => {
      service['invite'] = jest.fn();
    });

    it('should call invite', async () => {
      // When
      await service.diagnostic();

      // Then
      expect(service['invite']).toHaveBeenCalledWith(
        configDataMock.testEmail,
        configDataMock.testInstanceId,
      );
    });

    it('should throw if invite returns false', async () => {
      // Given
      service['invite'] = jest.fn().mockResolvedValueOnce(false);

      // When / Then
      await expect(service.diagnostic()).rejects.toThrow(
        'Diagnostic failed, can not invite',
      );
    });
  });

  describe('import', () => {
    beforeEach(() => {
      service['consolidateData'] = jest
        .fn()
        .mockReturnValueOnce(consolidatedDataMock);

      service['publishAndInvite'] = jest.fn();
    });

    it('should consolidate data', async () => {
      // When
      await service.import(csvDataMock, dbDataMock);

      // Then
      expect(service['consolidateData']).toHaveBeenCalledWith(
        csvDataMock,
        dbDataMock,
      );
    });

    it('should call publishAndInvite for each consolidated data', async () => {
      // When
      await service.import(csvDataMock, dbDataMock);

      // Then
      expect(service['publishAndInvite']).toHaveBeenCalledTimes(
        consolidatedDataMock.length,
      );
      expect(service['publishAndInvite']).toHaveBeenCalledWith(
        consolidatedDataMock[0],
      );
    });
  });

  describe('consolidateData', () => {
    it('should return consolidated data', () => {
      // When
      const result = service['consolidateData'](csvDataMock, dbDataMock);

      // Then
      expect(result).toEqual(consolidatedDataMock);
    });

    it('should log a warning if no service provider is found for a datapassId', () => {
      // When
      service['consolidateData'](csvDataMock, dbDataMock);

      // Then
      expect(loggerMock.warning).toHaveBeenCalledWith({
        msg: 'No service Provider found in DS for datapassId',
        datapassId: '333333',
      });
    });
  });

  describe('formatSpForConsumer', () => {
    it('should format service provider metadata for consumer', () => {
      // Given
      const { metadata: _metadata, ...sp } = dbDataMock[0];

      // When
      const result = service['formatSpForConsumer'](sp);

      // Then
      expect(result).toEqual({
        ...sp,
        scope: ['openid', 'profile', 'email'],
        environment: EnvironmentEnum.SANDBOX,
        createdBy: 'unknown-cli-user',
        createdVia: CreatedVia.COMMAND_IMPORT_SP_SANDBOX,
      });
    });
  });

  describe('publishAndInvite', () => {
    // Given
    const data =
      consolidatedDataMock[0] as unknown as ConsolidatedDataInterface;

    const instanceId = 'instance-id' as unknown as Uint8Array<ArrayBufferLike>;
    const versionId = 'version-id' as unknown as Uint8Array<ArrayBufferLike>;

    beforeEach(() => {
      uuidMock.mockReturnValueOnce(instanceId).mockReturnValueOnce(versionId);

      service['publish'] = jest.fn();
      service['invite'] = jest.fn();
    });

    it('should publish service provider', async () => {
      // When
      await service['publishAndInvite'](data);

      // Then
      expect(service['publish']).toHaveBeenCalledWith(
        data.sp,
        instanceId,
        versionId,
      );
    });

    it('should invite user to manage service provider', async () => {
      // When
      await service['publishAndInvite'](data);

      // Then
      expect(service['invite']).toHaveBeenCalledWith(data.email, instanceId);
    });
  });

  describe('publish', () => {
    // Given
    const data = consolidatedDataMock[0]
      .sp as unknown as ServiceProviderMetadata;
    const instanceId = 'instance-id';
    const versionId = 'version-id';
    const formattedData = Symbol(
      'formattedData',
    ) as unknown as ConfigCreateMessageDtoPayload;

    it('should publish service provider', async () => {
      // Given
      service['formatSpForConsumer'] = jest
        .fn()
        .mockReturnValueOnce(formattedData);

      const expectedPayload = {
        type: ActionTypes.CONFIG_CREATE,
        meta: {
          instanceId,
          versionId,
          publicationStatus: PublicationStatusEnum.PENDING,
        },
        payload: formattedData,
      };

      // When
      await service['publish'](data, instanceId, versionId);

      // Then
      expect(configSandboxLow.publish).toHaveBeenCalledWith(expectedPayload);
    });
  });

  describe('invite', () => {
    // Given
    const email = 'foo@bar.com';
    const instanceId = 'instance-id';
    const payload = 'emails%5B%5D=foo%40bar.com&instances%5B%5D=instance-id';

    beforeEach(() => {
      service['webhooksService'].sign = jest.fn();
      lastValueFromMock.mockResolvedValue({ status: 201 });
    });

    it('should call the invitation endpoint', async () => {
      // When
      await service['invite'](email, instanceId);

      // Then
      expect(httpServiceMock.post).toHaveBeenCalledWith(
        configDataMock.inviteEndpoint,
        expect.any(String),
        expect.any(Object),
      );
    });

    it('should generate the payload', async () => {
      // When
      await service['invite'](email, instanceId);

      // Then
      expect(httpServiceMock.post).toHaveBeenCalledWith(
        expect.any(String),
        payload,
        expect.any(Object),
      );
    });

    it('should send the signature in the header', async () => {
      // Given
      const signatureMock = 'signature-mock';
      webhooksService.sign.mockReturnValueOnce(signatureMock);

      // When
      await service['invite'](email, instanceId);

      // Then
      expect(httpServiceMock.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({
          headers: {
            [HUB_SIGN_HEADER]: signatureMock,
          },
        }),
      );
    });

    it('should sign the payload', async () => {
      // When
      await service['invite'](email, instanceId);

      // Then
      expect(service['webhooksService'].sign).toHaveBeenCalledWith(
        WEBHOOK_NAME,
        payload,
      );
    });

    it('should log a warning if the invitation fails', async () => {
      // Given
      const error = new Error('Invitation failed');
      lastValueFromMock.mockRejectedValueOnce(error);

      // When
      await service['invite'](email, instanceId);

      // Then
      expect(loggerMock.warning).toHaveBeenCalledWith({
        msg: 'Error while inviting user',
        error: error.message,
        email,
        instanceId,
      });
    });

    it('should log a warning if the invitation does not return an 201 HTTP code', async () => {
      // Given
      lastValueFromMock.mockResolvedValueOnce({
        status: 500,
        statusText: 'Internal Server Error',
      });

      // When
      await service['invite'](email, instanceId);

      // Then
      expect(loggerMock.warning).toHaveBeenCalledWith({
        msg: 'Error while inviting user',
        error: '500 Internal Server Error',
        email,
        instanceId,
      });
    });
  });
});
