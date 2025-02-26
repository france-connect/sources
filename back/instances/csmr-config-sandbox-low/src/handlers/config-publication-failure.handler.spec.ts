import { Test, TestingModule } from '@nestjs/testing';

import { PublicationStatusEnum } from '@entities/typeorm';

import { ActionTypes, ConfigMessageDto } from '@fc/csmr-config-client';
import { ExceptionCaughtEvent } from '@fc/exceptions';

import { ConfigPublicationFailureEventHandler } from './config-publication-failure.handler';

describe('ConfigPublicationFailureEventHandler', () => {
  let handler: ConfigPublicationFailureEventHandler;

  const configClientMock = {
    publish: jest.fn(),
  };

  const ctxMock = {
    getData: jest.fn(),
  };

  const messageMock = {
    type: 'MOCK',
    meta: { id: 'meta-mock' },
    payload: { id: 'payload-mock' },
  } as unknown as ConfigMessageDto;

  const error = new Error('error');

  const eventMock = new ExceptionCaughtEvent(error, ctxMock);

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigPublicationFailureEventHandler,
        {
          provide: 'ConfigPartners',
          useValue: configClientMock,
        },
      ],
    }).compile();

    handler = module.get<ConfigPublicationFailureEventHandler>(
      ConfigPublicationFailureEventHandler,
    );

    ctxMock.getData.mockReturnValue(messageMock);
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
          publicationStatus: PublicationStatusEnum.FAILED,
        },
      });
    });
  });
});
