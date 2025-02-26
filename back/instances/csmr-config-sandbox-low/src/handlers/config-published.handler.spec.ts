import { Test, TestingModule } from '@nestjs/testing';

import { PublicationStatusEnum } from '@entities/typeorm';

import { ConfigPublishedEvent } from '@fc/csmr-config';
import { ActionTypes, ConfigMessageDto } from '@fc/csmr-config-client';

import { ConfigPublishedEventHandler } from './config-published.handler';

describe('ConfigPublishedEventHandler', () => {
  let handler: ConfigPublishedEventHandler;

  const configClientMock = {
    publish: jest.fn(),
  };

  const messageMock = {
    type: 'MOCK',
    meta: { id: 'meta-mock' },
    payload: { id: 'payload-mock' },
  } as unknown as ConfigMessageDto;

  const eventMock = new ConfigPublishedEvent(messageMock);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigPublishedEventHandler,
        {
          provide: 'ConfigPartners',
          useValue: configClientMock,
        },
      ],
    }).compile();

    handler = module.get<ConfigPublishedEventHandler>(
      ConfigPublishedEventHandler,
    );
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('handle', () => {
    it('should publish a message to the config partners', async () => {
      await handler.handle(eventMock);

      expect(configClientMock.publish).toHaveBeenCalledWith({
        type: ActionTypes.CONFIG_UPDATE,
        payload: {
          id: 'payload-mock',
        },
        meta: {
          ...messageMock.meta,
          publicationStatus: PublicationStatusEnum.PUBLISHED,
        },
      });
    });
  });
});
