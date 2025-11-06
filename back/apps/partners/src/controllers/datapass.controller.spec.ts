import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { DatapassEvents, SimplifiedDatapassPayload } from '@fc/datapass';
import { LoggerService } from '@fc/logger';
import { WebhooksGuard } from '@fc/webhooks';

import { getLoggerMock } from '@mocks/logger';

import { PartnersDatapassService } from '../services';
import { DatapassWebhookController } from './datapass.controller';

describe('DatapassWebhookController', () => {
  let controller: DatapassWebhookController;

  const loggerMock = getLoggerMock();

  const partnersDatapassServiceMock = {
    handleWebhookEvent: jest.fn(),
  };

  const resMock = {
    status: jest.fn(),
    json: jest.fn(),
  };

  const webhookMock: SimplifiedDatapassPayload = {
    event: DatapassEvents.APPROVE,
    datapassRequestId: '12345',
    state: 'approve',
    organizationName: 'UMAD CORP',
    applicant: {
      email: 'jean.dupont@beta.gouv.fr',
      firstname: 'Jean',
      lastname: 'Dupont',
    },
    technicalContact: {
      email: 'tech@beta.gouv.fr',
      firstname: 'Tech',
      lastname: 'Os',
    },
    datapassName: 'Ma demande',
    scopes: ['identite_pivot', 'email'],
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatapassWebhookController],
      providers: [LoggerService, PartnersDatapassService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideGuard(WebhooksGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideProvider(PartnersDatapassService)
      .useValue(partnersDatapassServiceMock)
      .compile();

    controller = module.get<DatapassWebhookController>(
      DatapassWebhookController,
    );

    resMock.status.mockReturnValue(resMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleWebhook', () => {
    it('should log webhook properties', async () => {
      // Given
      partnersDatapassServiceMock.handleWebhookEvent.mockResolvedValueOnce({
        statusCode: HttpStatus.CREATED,
      });

      // When
      await controller.handleWebhook(webhookMock, resMock);

      // Then
      expect(loggerMock.info).toHaveBeenCalledExactlyOnceWith({
        message: 'Datapass webhook received and validated',
        event: 'approve',
        datapassRequestId: '12345',
      });
    });

    it('should call partnersDatapassServiceMock.handleWebhookEvent', async () => {
      // Given
      partnersDatapassServiceMock.handleWebhookEvent.mockResolvedValueOnce({
        statusCode: HttpStatus.CREATED,
      });

      // When
      await controller.handleWebhook(webhookMock, resMock);

      // Then
      expect(
        partnersDatapassServiceMock.handleWebhookEvent,
      ).toHaveBeenCalledExactlyOnceWith(webhookMock);
    });

    it('should respond with correct status and token_id', async () => {
      // Given
      partnersDatapassServiceMock.handleWebhookEvent.mockResolvedValueOnce({
        statusCode: HttpStatus.CREATED,
      });

      // When
      await controller.handleWebhook(webhookMock, resMock);

      // Then
      expect(resMock.status).toHaveBeenCalledExactlyOnceWith(
        HttpStatus.CREATED,
      );
    });

    it('should respond with different status when service returns different statusCode', async () => {
      // Given
      partnersDatapassServiceMock.handleWebhookEvent.mockResolvedValueOnce({
        statusCode: HttpStatus.NO_CONTENT,
      });

      // When
      await controller.handleWebhook(webhookMock, resMock);

      // Then
      expect(resMock.status).toHaveBeenCalledExactlyOnceWith(
        HttpStatus.NO_CONTENT,
      );
    });

    it('should always return token_id', async () => {
      // Given
      partnersDatapassServiceMock.handleWebhookEvent.mockResolvedValueOnce({
        statusCode: HttpStatus.CREATED,
        serviceProviderId:
          'this_is_an_id_for_datapass_to_keep_and_display_on_the_habilitation',
      });

      // When
      await controller.handleWebhook(webhookMock, resMock);

      // Then
      expect(resMock.json).toHaveBeenCalledExactlyOnceWith({
        token_id:
          'this_is_an_id_for_datapass_to_keep_and_display_on_the_habilitation',
      });
    });
  });
});
