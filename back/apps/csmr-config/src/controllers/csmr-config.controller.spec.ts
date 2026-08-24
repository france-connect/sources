import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import {
  ConfigCreateMessageDto,
  ConfigDeleteMessageDto,
  ConfigUpdateMessageDto,
} from '@fc/csmr-config-client/protocol';
import { MicroservicesRmqSubscriberService } from '@fc/microservices-rmq';

import { getSubscriberMock } from '@mocks/microservices-rmq';

import { ConfigPublishedEvent } from '../events';
import { CsmrConfigService } from '../services';
import { CsmrConfigController } from './csmr-config.controller';

describe('CsmrConfigController', () => {
  let controller: CsmrConfigController;

  const configServiceMock = {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const eventBusMock = {
    publish: jest.fn(),
  };

  const subscriberMock = getSubscriberMock();

  const createResult = Symbol('createResult');
  const updateResult = Symbol('updateResult');
  const deleteResult = Symbol('deleteResult');

  const messageMock = {
    type: 'MOCK',
    meta: { id: 'meta-mock' },
    payload: { id: 'payload-mock' },
  };

  const createMessageMock = messageMock as unknown as ConfigCreateMessageDto;
  const updateMessageMock = messageMock as unknown as ConfigUpdateMessageDto;

  const deleteMessageMock = {
    type: 'MOCK',
    meta: { id: 'meta-mock' },
    payload: { client_id: 'client-id-mock' },
  } as unknown as ConfigDeleteMessageDto;

  const responseMock = Symbol('responseMock');

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsmrConfigController,
        CsmrConfigService,
        EventBus,
        MicroservicesRmqSubscriberService,
      ],
    })
      .overrideProvider(CsmrConfigService)
      .useValue(configServiceMock)
      .overrideProvider(EventBus)
      .useValue(eventBusMock)
      .overrideProvider(MicroservicesRmqSubscriberService)
      .useValue(subscriberMock)
      .compile();

    controller = module.get<CsmrConfigController>(CsmrConfigController);

    configServiceMock.create.mockResolvedValue(createResult);
    configServiceMock.update.mockResolvedValue(updateResult);
    configServiceMock.delete.mockResolvedValue(deleteResult);

    subscriberMock.response.mockReturnValue(responseMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createConfig', () => {
    it('should create config with configDatabaseService', async () => {
      // When
      await controller.createConfig(createMessageMock);

      // Then
      expect(configServiceMock.create).toHaveBeenCalledExactlyOnceWith(
        createMessageMock,
      );
    });

    it('should publish a ConfigPublishedEvent', async () => {
      // When
      await controller.createConfig(createMessageMock);

      // Then
      expect(eventBusMock.publish).toHaveBeenCalledExactlyOnceWith(
        expect.any(ConfigPublishedEvent),
      );
    });

    it('should return result of subscriber.response()', async () => {
      // When
      const result = await controller.createConfig(createMessageMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });

  describe('updateConfig', () => {
    it('should update config with configDatabaseService', async () => {
      // When
      await controller.updateConfig(updateMessageMock);

      // Then
      expect(configServiceMock.update).toHaveBeenCalledExactlyOnceWith(
        updateMessageMock,
      );
    });

    it('should publish a ConfigPublishedEvent', async () => {
      // When
      await controller.createConfig(createMessageMock);

      // Then
      expect(eventBusMock.publish).toHaveBeenCalledExactlyOnceWith(
        expect.any(ConfigPublishedEvent),
      );
    });

    it('should return result of subscriber.response()', async () => {
      // When
      const result = await controller.updateConfig(updateMessageMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });

  describe('deleteConfig', () => {
    it('should delete config with configService', async () => {
      // When
      await controller.deleteConfig(deleteMessageMock);

      // Then
      expect(configServiceMock.delete).toHaveBeenCalledExactlyOnceWith(
        deleteMessageMock,
      );
    });

    it('should publish a ConfigPublishedEvent', async () => {
      // When
      await controller.deleteConfig(deleteMessageMock);

      // Then
      expect(eventBusMock.publish).toHaveBeenCalledExactlyOnceWith(
        expect.any(ConfigPublishedEvent),
      );
    });

    it('should return result of subscriber.response()', async () => {
      // When
      const result = await controller.deleteConfig(deleteMessageMock);

      // Then
      expect(result).toBe(responseMock);
    });
  });
});
