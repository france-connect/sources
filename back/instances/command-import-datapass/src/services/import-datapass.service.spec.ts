import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import {
  DatapassApiService,
  DatapassEidasLevels,
  DatapassEvents,
  DatapassPayloadInterface,
} from '@fc/datapass';
import { LoggerService } from '@fc/logger';
import { HUB_SIGN_HEADER, WebhooksService } from '@fc/webhooks';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { WEBHOOK_NAME } from '../constants';
import { ImportDatapassService } from './import-datapass.service';

jest.mock('rxjs');

describe('ImportDatapassService', () => {
  let service: ImportDatapassService;

  const configMock = getConfigMock();
  const loggerMock = getLoggerMock();

  const datapassApiMock = {
    getHabilitations: jest.fn(),
    getHabilitationById: jest.fn(),
  };

  const webhooksMock = {
    sign: jest.fn(),
  };

  const httpServiceMock = {
    post: jest.fn(),
  };

  const lastValueFromMock = jest.mocked(lastValueFrom);

  const webhooksPartnersConfigMock = {
    url: 'https://partners.example.com/webhook',
    secret: 'secret',
  };

  const demandeMock: DatapassPayloadInterface = {
    event: DatapassEvents.APPROVE,
    fired_at: 1700000000,
    model_type: 'AuthorizationRequest',
    last_validated_at: '2024-01-15T10:00:00Z',
    data: {
      id: 42,
      public_id: 'public-id-42',
      state: 'validated',
      form_uid: 'france-connect',
      organization: {
        id: 100,
        name: 'Entreprise Test',
        siret: '12345678901234',
      },
      applicant: {
        email: 'applicant@example.com',
        given_name: 'Alice',
        family_name: 'Martin',
      },
      data: {
        intitule: 'Test Service',
        scopes: ['openid', 'profile'],
        france_connect_eidas: DatapassEidasLevels.EIDAS_1,
        contact_technique_given_name: 'Jean',
        contact_technique_family_name: 'Dupont',
        contact_technique_phone_number: '+33123456789',
        contact_technique_email: 'tech@example.com',
      },
      authorizations: [
        {
          id: '10',
          state: 'validated',
          authorization_request_class: 'AuthorizationRequest::FranceConnect',
          revoked: false,
        },
      ],
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportDatapassService,
        ConfigService,
        DatapassApiService,
        WebhooksService,
        HttpService,
        LoggerService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(DatapassApiService)
      .useValue(datapassApiMock)
      .overrideProvider(WebhooksService)
      .useValue(webhooksMock)
      .overrideProvider(HttpService)
      .useValue(httpServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<ImportDatapassService>(ImportDatapassService);

    configMock.get.mockReturnValue(webhooksPartnersConfigMock);
    webhooksMock.sign.mockReturnValue('sha256=signature-mock');
    lastValueFromMock.mockResolvedValue({ status: 201 });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('importAll', () => {
    beforeEach(() => {
      service['processOne'] = jest.fn().mockResolvedValue(true);
    });

    it('should call getHabilitations with default eidasLevels when none are provided', async () => {
      // Given
      datapassApiMock.getHabilitations.mockResolvedValue([]);

      // When
      await service.importAll([DatapassEidasLevels.EIDAS_1], false);

      // Then
      expect(datapassApiMock.getHabilitations).toHaveBeenCalledExactlyOnceWith(
        [DatapassEidasLevels.EIDAS_1],
        undefined,
      );
    });

    it('should pass "since" to getHabilitations when provided', async () => {
      // Given
      const since = new Date('2025-01-01');
      datapassApiMock.getHabilitations.mockResolvedValue([]);

      // When
      await service.importAll([DatapassEidasLevels.EIDAS_1], false, since);

      // Then
      expect(datapassApiMock.getHabilitations).toHaveBeenCalledExactlyOnceWith(
        [DatapassEidasLevels.EIDAS_1],
        since,
      );
    });

    it('should pass "eidasLevels" to getHabilitations when provided', async () => {
      // Given
      const eidasLevels = [DatapassEidasLevels.EIDAS_2];
      datapassApiMock.getHabilitations.mockResolvedValue([]);

      // When
      await service.importAll(eidasLevels, false);

      // Then
      expect(datapassApiMock.getHabilitations).toHaveBeenCalledExactlyOnceWith(
        eidasLevels,
        undefined,
      );
    });

    it('should pass both since and eidasLevels to getHabilitations when provided', async () => {
      // Given
      const since = new Date('2025-01-01');
      const eidasLevels = [
        DatapassEidasLevels.EIDAS_1,
        DatapassEidasLevels.EIDAS_2,
      ];
      datapassApiMock.getHabilitations.mockResolvedValue([]);

      // When
      await service.importAll(eidasLevels, false, since);

      // Then
      expect(datapassApiMock.getHabilitations).toHaveBeenCalledExactlyOnceWith(
        eidasLevels,
        since,
      );
    });

    it('should call processOne for each request', async () => {
      // Given
      const demande1 = { ...demandeMock, data: { ...demandeMock.data, id: 1 } };
      const demande2 = { ...demandeMock, data: { ...demandeMock.data, id: 2 } };
      datapassApiMock.getHabilitations.mockResolvedValue([demande1, demande2]);

      // When
      await service.importAll([DatapassEidasLevels.EIDAS_1], false);

      // Then
      expect(service['processOne']).toHaveBeenCalledTimes(2);
      expect(service['processOne']).toHaveBeenCalledWith(demande1, false);
      expect(service['processOne']).toHaveBeenCalledWith(demande2, false);
    });

    it('should return total, success and failure counts', async () => {
      // Given
      datapassApiMock.getHabilitations.mockResolvedValue([demandeMock]);

      // When
      const result = await service.importAll(
        [DatapassEidasLevels.EIDAS_1],
        false,
      );

      // Then
      expect(result).toEqual({ total: 1, success: 1, failure: 0 });
    });

    it('should count failure when processOne returns false', async () => {
      // Given
      datapassApiMock.getHabilitations.mockResolvedValue([demandeMock]);
      jest.mocked(service['processOne']).mockResolvedValue(false);

      // When
      const result = await service.importAll(
        [DatapassEidasLevels.EIDAS_1],
        false,
      );

      // Then
      expect(result).toEqual({ total: 1, success: 0, failure: 1 });
    });

    it('should count both successes and failures in mixed results', async () => {
      // Given
      const demande1 = { ...demandeMock, data: { ...demandeMock.data, id: 1 } };
      const demande2 = { ...demandeMock, data: { ...demandeMock.data, id: 2 } };
      const demande3 = { ...demandeMock, data: { ...demandeMock.data, id: 3 } };
      datapassApiMock.getHabilitations.mockResolvedValue([
        demande1,
        demande2,
        demande3,
      ]);
      jest
        .mocked(service['processOne'])
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      // When
      const result = await service.importAll(
        [DatapassEidasLevels.EIDAS_1],
        false,
      );

      // Then
      expect(result).toEqual({ total: 3, success: 2, failure: 1 });
    });

    it('should pass dryRun to processOne', async () => {
      // Given
      datapassApiMock.getHabilitations.mockResolvedValue([demandeMock]);

      // When
      await service.importAll([DatapassEidasLevels.EIDAS_1], true);

      // Then
      expect(service['processOne']).toHaveBeenCalledExactlyOnceWith(
        demandeMock,
        true,
      );
    });

    it('should return correct counts when dryRun is true', async () => {
      // Given
      datapassApiMock.getHabilitations.mockResolvedValue([
        demandeMock,
        demandeMock,
      ]);

      // When
      const result = await service.importAll(
        [DatapassEidasLevels.EIDAS_1],
        true,
      );

      // Then
      expect(result).toEqual({ total: 2, success: 2, failure: 0 });
    });
  });

  describe('processOne (private)', () => {
    beforeEach(() => {
      service['sendToWebhook'] = jest.fn().mockResolvedValue(true);
    });

    it('should call sendToWebhook when dryRun is false', async () => {
      // When
      await service['processOne'](demandeMock, false);

      // Then
      expect(service['sendToWebhook']).toHaveBeenCalledExactlyOnceWith(
        demandeMock,
      );
    });

    it('should not call sendToWebhook when dryRun is true', async () => {
      // When
      await service['processOne'](demandeMock, true);

      // Then
      expect(service['sendToWebhook']).not.toHaveBeenCalled();
    });

    it('should log the habilitation id when dryRun is true', async () => {
      // When
      await service['processOne'](demandeMock, true);

      // Then
      expect(loggerMock.info).toHaveBeenCalledExactlyOnceWith({
        message: '[DRY-RUN] Would import habilitation',
        datapassRequestId: demandeMock.data.id,
      });
    });

    it('should return true when dryRun is true', async () => {
      // When
      const result = await service['processOne'](demandeMock, true);

      // Then
      expect(result).toBe(true);
    });

    it('should return the result of sendToWebhook when dryRun is false', async () => {
      // Given
      jest.mocked(service['sendToWebhook']).mockResolvedValue(false);

      // When
      const result = await service['processOne'](demandeMock, false);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('importById', () => {
    beforeEach(() => {
      service['sendToWebhook'] = jest.fn().mockResolvedValue(true);
    });

    it('should call getHabilitationById with the provided id', async () => {
      // Given
      datapassApiMock.getHabilitationById.mockResolvedValue(demandeMock);

      // When
      await service.importById(42);

      // Then
      expect(
        datapassApiMock.getHabilitationById,
      ).toHaveBeenCalledExactlyOnceWith(42);
    });

    it('should call sendToWebhook with the returned demande', async () => {
      // Given
      datapassApiMock.getHabilitationById.mockResolvedValue(demandeMock);

      // When
      await service.importById(42);

      // Then
      expect(service['sendToWebhook']).toHaveBeenCalledExactlyOnceWith(
        demandeMock,
      );
    });

    it('should throw when getHabilitationById throws', async () => {
      // Given
      const error = new Error('API failure');
      datapassApiMock.getHabilitationById.mockRejectedValue(error);

      // When / Then
      await expect(service.importById(42)).rejects.toThrow(error);
    });
  });

  describe('sendToWebhook (private)', () => {
    it('should get WebhooksPartners config', async () => {
      // When
      await service['sendToWebhook'](demandeMock);

      // Then
      expect(configMock.get).toHaveBeenCalledExactlyOnceWith(
        'WebhooksPartners',
      );
    });

    it('should sign the JSON-stringified payload with WEBHOOK_NAME', async () => {
      // Given
      const jsonPayload = JSON.stringify(demandeMock);

      // When
      await service['sendToWebhook'](demandeMock);

      // Then
      expect(webhooksMock.sign).toHaveBeenCalledExactlyOnceWith(
        WEBHOOK_NAME,
        jsonPayload,
      );
    });

    it('should post the JSON payload to the webhook url', async () => {
      // Given
      const jsonPayload = JSON.stringify(demandeMock);

      // When
      await service['sendToWebhook'](demandeMock);

      // Then
      expect(httpServiceMock.post).toHaveBeenCalledExactlyOnceWith(
        webhooksPartnersConfigMock.url,
        jsonPayload,
        expect.any(Object),
      );
    });

    it('should include Content-Type and HUB_SIGN_HEADER in the request headers', async () => {
      // Given
      const signatureMock = 'sha256=abc123';
      webhooksMock.sign.mockReturnValue(signatureMock);

      // When
      await service['sendToWebhook'](demandeMock);

      // Then
      expect(httpServiceMock.post).toHaveBeenCalledExactlyOnceWith(
        expect.any(String),
        expect.any(String),
        {
          headers: {
            'Content-Type': 'application/json',
            [HUB_SIGN_HEADER]: signatureMock,
          },
        },
      );
    });

    it('should call lastValueFrom with the observable returned by httpService.post', async () => {
      // When
      await service['sendToWebhook'](demandeMock);

      // Then
      expect(lastValueFromMock).toHaveBeenCalledExactlyOnceWith(
        httpServiceMock.post.mock.results[0].value,
      );
    });

    it('should log info with the datapassRequestId on success', async () => {
      // When
      await service['sendToWebhook'](demandeMock);

      // Then
      expect(loggerMock.info).toHaveBeenCalledExactlyOnceWith({
        message: 'Habilitation imported',
        datapassRequestId: demandeMock.data.id,
      });
    });

    it('should return true on success', async () => {
      // When
      const result = await service['sendToWebhook'](demandeMock);

      // Then
      expect(result).toBe(true);
    });

    it('should log a warning with the error message on failure', async () => {
      // Given
      const error = new Error('Connection refused');
      lastValueFromMock.mockRejectedValue(error);

      // When
      await service['sendToWebhook'](demandeMock);

      // Then
      expect(loggerMock.warning).toHaveBeenCalledExactlyOnceWith({
        message: 'Failed to import habilitation',
        datapassRequestId: demandeMock.data.id,
        error: error.message,
        httpStatus: undefined,
        responseBody: undefined,
      });
    });

    it('should log httpStatus and responseBody when the error has an axios response', async () => {
      // Given
      const axiosError = Object.assign(
        new Error('Request failed with status code 500'),
        {
          response: { status: 500, data: { error: 'Internal Server Error' } },
        },
      );
      lastValueFromMock.mockRejectedValue(axiosError);

      // When
      await service['sendToWebhook'](demandeMock);

      // Then
      expect(loggerMock.warning).toHaveBeenCalledExactlyOnceWith({
        message: 'Failed to import habilitation',
        datapassRequestId: demandeMock.data.id,
        error: axiosError.message,
        responseBody: { error: 'Internal Server Error' },
      });
    });

    it('should return false on failure', async () => {
      // Given
      lastValueFromMock.mockRejectedValue(new Error('Connection refused'));

      // When
      const result = await service['sendToWebhook'](demandeMock);

      // Then
      expect(result).toBe(false);
    });

    it('should not log info on failure', async () => {
      // Given
      lastValueFromMock.mockRejectedValue(new Error('Connection refused'));

      // When
      await service['sendToWebhook'](demandeMock);

      // Then
      expect(loggerMock.info).not.toHaveBeenCalled();
    });
  });
});
