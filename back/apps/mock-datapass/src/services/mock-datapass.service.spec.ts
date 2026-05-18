import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { AxiosError } from 'axios';
import { mocked } from 'jest-mock';
import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { HUB_SIGN_HEADER, WebhooksService } from '@fc/webhooks';

import { getConfigMock } from '@mocks/config';
import { getWebhooksServiceMock } from '@mocks/webhooks';

import { MockDatapassService } from './mock-datapass.service';

jest.mock('fs');
jest.mock('rxjs', () => ({
  ...jest.requireActual('rxjs'),
  lastValueFrom: jest.fn(),
}));

describe('MockDatapassService', () => {
  let service: MockDatapassService;

  const lastValueFromMock = jest.mocked(lastValueFrom);
  const configMock = getConfigMock();
  const webhooksMock = getWebhooksServiceMock();
  const httpServiceMock = {
    post: jest.fn(),
  };

  const webhookUrl = 'http://example.com/webhook';
  const payloadsPath = '/var/mock-datapass/payloads';
  const successFixture = {
    label: 'Payload Succès',
    payload: {
      event: 'approve',
      fired_at: 1753704929,
    },
  };
  const failureFixture = {
    label: 'Payload Échec (DTO invalide)',
    payload: {
      event: 'approve',
      fired_at: 'not_a_number',
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MockDatapassService,
        ConfigService,
        WebhooksService,
        HttpService,
      ],
    })
      .overrideProvider(WebhooksService)
      .useValue(webhooksMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(HttpService)
      .useValue(httpServiceMock)
      .compile();

    service = module.get<MockDatapassService>(MockDatapassService);

    configMock.get.mockReturnValue({
      webhookUrl,
      payloadsPath,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    beforeEach(() => {
      mocked(readdirSync).mockReturnValue([
        '02-failure-invalid-dto.json',
        '01-success.json',
      ] as never);
      mocked(readFileSync).mockImplementation((filePath) => {
        const fixturesByPath = {
          [join(payloadsPath, '01-success.json')]:
            JSON.stringify(successFixture),
          [join(payloadsPath, '02-failure-invalid-dto.json')]:
            JSON.stringify(failureFixture),
        };

        return fixturesByPath[String(filePath)] as never;
      });
    });

    it('should retrieve payloads path from config', () => {
      // When
      service.onModuleInit();

      // Then
      expect(configMock.get).toHaveBeenCalledWith('App');
    });

    it('should read the payload fixtures directory', () => {
      // When
      service.onModuleInit();

      // Then
      expect(readdirSync).toHaveBeenCalledTimes(1);
      expect(readdirSync).toHaveBeenCalledWith(payloadsPath);
    });

    it('should read each payload fixture file', () => {
      // When
      service.onModuleInit();

      // Then
      expect(readFileSync).toHaveBeenCalledTimes(2);
      expect(readFileSync).toHaveBeenNthCalledWith(
        1,
        join(payloadsPath, '01-success.json'),
        {
          encoding: 'utf-8',
        },
      );
      expect(readFileSync).toHaveBeenNthCalledWith(
        2,
        join(payloadsPath, '02-failure-invalid-dto.json'),
        {
          encoding: 'utf-8',
        },
      );
    });

    it('should load payload presets from fixtures', () => {
      // When
      service.onModuleInit();

      // Then
      expect(service.getPayloadPresets()).toEqual([
        {
          id: '01-success.json',
          label: 'Payload Succès',
          payload: JSON.stringify(successFixture.payload, null, 2),
        },
        {
          id: '02-failure-invalid-dto.json',
          label: 'Payload Échec (DTO invalide)',
          payload: JSON.stringify(failureFixture.payload, null, 2),
        },
      ]);
    });

    it('should sort payloads using filename order', () => {
      // Given
      mocked(readdirSync).mockReturnValue([
        '02-failure-invalid-dto.json',
        '01-success.json',
        '03-another-failure.json',
      ] as never);

      mocked(readFileSync).mockImplementation((filePath) => {
        const fixturesByPath = {
          [join(payloadsPath, '01-success.json')]:
            JSON.stringify(successFixture),
          [join(payloadsPath, '02-failure-invalid-dto.json')]:
            JSON.stringify(failureFixture),
          [join(payloadsPath, '03-another-failure.json')]: JSON.stringify({
            label: 'Payload Échec (autre)',
            payload: {
              event: 'reject',
            },
          }),
        };

        return fixturesByPath[String(filePath)] as never;
      });

      // When
      service.onModuleInit();

      // Then
      expect(service.getPayloadPresets()[0].id).toBe('01-success.json');
    });

    it('should sort filenames alphabetically when none is success', () => {
      // Given
      mocked(readdirSync).mockReturnValue([
        '02-z-last.json',
        '01-a-first.json',
      ] as never);

      mocked(readFileSync).mockImplementation((filePath) => {
        const fixturesByPath = {
          [join(payloadsPath, '01-a-first.json')]: JSON.stringify({
            label: 'A',
            payload: { event: 'a' },
          }),
          [join(payloadsPath, '02-z-last.json')]: JSON.stringify({
            label: 'Z',
            payload: { event: 'z' },
          }),
        };

        return fixturesByPath[String(filePath)] as never;
      });

      // When
      service.onModuleInit();

      // Then
      expect(service.getPayloadPresets().map(({ id }) => id)).toEqual([
        '01-a-first.json',
        '02-z-last.json',
      ]);
    });
  });

  describe('handleWebhook', () => {
    const payloadMock = '{ "event": "approve" }';
    const signatureMock = 'signatureMock';
    const expectedResponse = { data: 'response data' };

    beforeEach(() => {
      service['callWebhook'] = jest.fn().mockResolvedValue(expectedResponse);
      webhooksMock.sign.mockReturnValue(signatureMock);
    });

    it('should sign payload with WebhooksService', async () => {
      // When
      await service.handleWebhook(payloadMock);

      // Then
      expect(webhooksMock.sign).toHaveBeenCalledWith(
        'WebhooksDatapass',
        payloadMock,
      );
    });

    it('should call webhook with payload and signature', async () => {
      // When
      await service.handleWebhook(payloadMock);

      // Then
      expect(service['callWebhook']).toHaveBeenCalledWith(
        payloadMock,
        signatureMock,
      );
    });

    it('should return the response from callWebhook', async () => {
      // When
      const response = await service.handleWebhook(payloadMock);

      // Then
      expect(response).toBe(expectedResponse);
    });

    it('should return handled response when callWebhook throws', async () => {
      // Given
      const errorResponse = { status: 400, data: { message: 'Bad Request' } };
      const axiosError = new AxiosError('Request failed');
      axiosError.response = errorResponse as never;
      service['callWebhook'] = jest.fn().mockRejectedValueOnce(axiosError);

      // When
      const response = await service.handleWebhook(payloadMock);

      // Then
      expect(response).toBe(errorResponse);
    });
  });

  describe('callWebhook', () => {
    const expectedResponse = { data: 'response data' };

    beforeEach(() => {
      lastValueFromMock.mockResolvedValueOnce(expectedResponse);
    });

    it('should call HttpService.post with correct parameters', async () => {
      // Given
      const payload = 'payload';
      const signature = 'signature';

      // When
      await service['callWebhook'](payload, signature);

      // Then
      expect(httpServiceMock.post).toHaveBeenCalledWith(webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          [HUB_SIGN_HEADER]: signature,
        },
      });
    });

    it('should return the response data from HttpService', async () => {
      // When
      const response = await service['callWebhook']('payload', 'signature');

      // Then
      expect(response).toBe(expectedResponse);
    });
  });

  describe('handleWebhookError', () => {
    it('should return the error response when AxiosError has a response', () => {
      // Given
      const errorResponse = { status: 400, data: { message: 'Bad Request' } };
      const axiosError = new AxiosError('Request failed');
      axiosError.response = errorResponse as never;

      // When
      const response = service['handleWebhookError'](axiosError);

      // Then
      expect(response).toBe(errorResponse);
    });

    it('should rethrow non-Axios errors', () => {
      // Given
      const genericError = new Error('Network error');

      // When / Then
      expect(() => service['handleWebhookError'](genericError)).toThrow(
        'Network error',
      );
    });
  });
});
