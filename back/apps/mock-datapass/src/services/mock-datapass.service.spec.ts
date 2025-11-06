import { lastValueFrom } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { DatapassEvents, DatapassPayloadInterface } from '@fc/datapass';
import { HUB_SIGN_HEADER, WebhooksService } from '@fc/webhooks';

import { getConfigMock } from '@mocks/config';
import { getWebhooksServiceMock } from '@mocks/webhooks';

import { MockDatapassService } from './mock-datapass.service';

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

  beforeEach(async () => {
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
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleWebhook', () => {
    const payloadMock = '{ stringified payload }';
    const signatureMock = 'signatureMock';
    const event = DatapassEvents.APPROVE;
    const callResult = { data: 'response data' };

    beforeEach(() => {
      service['generatePayload'] = jest.fn().mockReturnValue(payloadMock);
      service['callWebhook'] = jest.fn().mockResolvedValue(callResult);
      webhooksMock.sign.mockReturnValue(signatureMock);
    });

    it('should generate payload with the correct event', async () => {
      // When
      await service.handleWebhook(event);

      // Then
      expect(service['generatePayload']).toHaveBeenCalledWith(event);
    });

    it('should sign payload with WebhooksService', async () => {
      // When
      await service.handleWebhook(event);

      // Then
      expect(webhooksMock.sign).toHaveBeenCalledWith(
        'WebhooksDatapass',
        payloadMock,
      );
    });

    it('should call webhook with payload and signature', async () => {
      // When
      await service.handleWebhook(event);

      // Then
      expect(service['callWebhook']).toHaveBeenCalledWith(
        payloadMock,
        signatureMock,
      );
    });

    it('should return the result of callWebhook', async () => {
      // When
      const result = await service.handleWebhook(event);

      // Then
      expect(result).toBe(callResult);
    });
  });

  describe('callWebhook', () => {
    // Given
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
      const result = await service['callWebhook']('payload', 'signature');

      // Then
      expect(result).toBe(expectedResponse);
    });
  });

  describe('generatePayload', () => {
    it('should return a stringified payload with the correct event', () => {
      // Given
      const timestampMock = 1753704929;
      service['getTimestamp'] = jest.fn().mockReturnValue(timestampMock);
      const event = DatapassEvents.APPROVE;

      const payload: DatapassPayloadInterface = {
        event,
        fired_at: timestampMock,
        model_type: 'authorization_request/franceconnect',
        data: {
          id: 9001,
          public_id: 'a90939e8-f906-4343-8996-5955257f161d',
          state: 'approve',
          form_uid: 'franceconnect-demande-libre',
          organization: {
            id: 9002,
            name: 'UMAD CORP',
            siret: '98043033400022',
          },
          applicant: {
            id: 9003,
            email: 'jean.dupont@beta.gouv.fr',
            given_name: 'Jean',
            family_name: 'Dupont',
            phone_number: '0836656565',
            job_title: 'Rockstar',
          },
          data: {
            intitule: 'Ma demande',
            scopes: ['identite_pivot', 'email'],
            contact_technique_given_name: 'Tech',
            contact_technique_family_name: 'Os',
            contact_technique_phone_number: '08366666666',
            contact_technique_job_title: 'DSI',
            contact_technique_email: 'tech@beta.gouv.fr',
          },
        },
      };
      // When
      const result = service['generatePayload'](event);

      // Then
      expect(result).toBe(JSON.stringify(payload));
    });
  });

  describe('getTimestamp', () => {
    it('should return the current timestamp in seconds', () => {
      // Given
      const now = 1753704929123;
      jest.spyOn(Date, 'now').mockReturnValue(now);

      // When
      const result = service['getTimestamp']();

      // Then
      expect(result).toBe(1753704929);
    });
  });
});
