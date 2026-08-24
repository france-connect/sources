import { Test, TestingModule } from '@nestjs/testing';

import { PublicationStatusEnum } from '@entities/typeorm';

import { ConfigService } from '@fc/config';
import { diffKeys } from '@fc/config-abstract-adapter';
import { ConfigPublishedEvent } from '@fc/csmr-config';
import {
  ConfigDeletePublishedEventPropertiesInterface,
  ConfigWritePublishedEventPropertiesInterface,
} from '@fc/csmr-config/interfaces';
import { ActionTypes } from '@fc/csmr-config-client';
import { ActionTypes as ProxyActionTypes } from '@fc/csmr-proxy-client';

import { getConfigMock } from '@mocks/config';

import { ConfigPublishedEventHandler } from './config-published.handler';

describe('ConfigPublishedEventHandler', () => {
  let handler: ConfigPublishedEventHandler;

  const configMock = getConfigMock();

  const configClientMock = {
    publish: jest.fn(),
  };

  const proxyClientMock = {
    broadcast: jest.fn(),
  };

  const messageMock = {
    type: 'CONFIG_PUBLISHED',
    meta: { id: 'meta-mock', diff: ['som-prop'] },
    payload: { message: { payload: 'payload-mock', meta: {} } },
  } as unknown as ConfigWritePublishedEventPropertiesInterface;

  const deleteMessageMock = {
    ...messageMock,
    type: ActionTypes.CONFIG_DELETE,
  } as unknown as ConfigDeletePublishedEventPropertiesInterface;

  const eventMock = new ConfigPublishedEvent(messageMock);
  const deleteEventMock = new ConfigPublishedEvent(deleteMessageMock);

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigPublishedEventHandler,
        ConfigService,
        {
          provide: 'ConfigPartners',
          useValue: configClientMock,
        },
        {
          provide: 'Proxy',
          useValue: proxyClientMock,
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .compile();

    handler = module.get<ConfigPublishedEventHandler>(
      ConfigPublishedEventHandler,
    );

    configMock.get.mockReturnValue({
      updateProxy: false,
    });
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('handle', () => {
    beforeEach(() => {
      handler['updateProxy'] = jest.fn();
      handler['updateConfigOnPartner'] = jest.fn();
      handler['deleteConfigOnPartner'] = jest.fn();
    });

    it('should call deleteConfigOnPartner and return early for a CONFIG_DELETE event', async () => {
      // When
      await handler.handle(deleteEventMock);

      // Then
      expect(handler['deleteConfigOnPartner']).toHaveBeenCalledExactlyOnceWith(
        deleteMessageMock,
      );
    });

    it('should not update proxy nor partner for a CONFIG_DELETE event', async () => {
      // When
      await handler.handle(deleteEventMock);

      // Then
      expect(handler['updateProxy']).not.toHaveBeenCalled();
      expect(handler['updateConfigOnPartner']).not.toHaveBeenCalled();
    });

    it('should not call deleteConfigOnPartner for a non CONFIG_DELETE event', async () => {
      // When
      await handler.handle(eventMock);

      // Then
      expect(handler['deleteConfigOnPartner']).not.toHaveBeenCalled();
    });

    it('should call updateProxy and updateConfigOnPartner', async () => {
      // Given
      configMock.get.mockReturnValue({
        updateProxy: true,
      });

      // When
      await handler.handle(eventMock);

      // Then
      expect(handler['updateProxy']).toHaveBeenCalledExactlyOnceWith(
        messageMock,
      );
      expect(handler['updateConfigOnPartner']).toHaveBeenCalledExactlyOnceWith(
        messageMock,
      );
    });

    it('should call only updateConfigOnPartner', async () => {
      // Given
      await handler.handle(eventMock);

      // When
      expect(handler['updateProxy']).not.toHaveBeenCalled();
      expect(handler['updateConfigOnPartner']).toHaveBeenCalledExactlyOnceWith(
        messageMock,
      );
    });
  });

  describe('updateConfigOnPartner', () => {
    it('should publish a message to the config partners', async () => {
      // When
      await handler['updateConfigOnPartner'](messageMock);

      // Then
      expect(configClientMock.publish).toHaveBeenCalledWith({
        type: ActionTypes.CONFIG_UPDATE,
        payload: messageMock.payload.message.payload,
        meta: {
          ...messageMock.payload.message.meta,
          publicationStatus: PublicationStatusEnum.PUBLISHED,
        },
      });
    });
  });

  describe('deleteConfigOnPartner', () => {
    it('should publish the delete message to the config partners', async () => {
      // When
      await handler['deleteConfigOnPartner'](deleteMessageMock);

      // Then
      expect(configClientMock.publish).toHaveBeenCalledExactlyOnceWith(
        messageMock.payload.message,
      );
    });
  });

  describe('updateProxy', () => {
    it('should broadcast a message to the proxy', async () => {
      // Given
      const urlsMock = ['url1', 'url2'];
      handler['getProxyRelatedUrls'] = jest.fn().mockReturnValue(urlsMock);
      handler['hasProxyRelatedDiff'] = jest.fn().mockReturnValue(true);

      // When
      await handler['updateProxy'](messageMock);

      // Then
      expect(proxyClientMock.broadcast).toHaveBeenCalledExactlyOnceWith({
        type: ProxyActionTypes.PUT_URLS,
        payload: {
          urls: urlsMock,
        },
        meta: {
          ...messageMock.payload.message.meta,
          spId: messageMock.meta.id,
        },
      });
    });

    it('should not broadcast a message to the proxy if there are no proxy related diffs', async () => {
      // Given
      handler['hasProxyRelatedDiff'] = jest.fn().mockReturnValue(false);

      // When
      await handler['updateProxy'](messageMock);

      // Then
      expect(proxyClientMock.broadcast).not.toHaveBeenCalled();
    });
  });

  describe('hasProxyRelatedDiff', () => {
    it('should return true if diff contains proxy related properties', () => {
      // Given
      const diff = [
        'sector_identifier_uri',
        'otherProperty',
      ] as unknown as diffKeys;

      // When
      const result = handler['hasProxyRelatedDiff'](diff);

      // Then
      expect(result).toBe(true);
    });

    it('should return false if diff does not contain proxy related properties', () => {
      // Given
      const diff = [
        'not_related_property',
        'otherProperty',
      ] as unknown as diffKeys;

      // When
      const result = handler['hasProxyRelatedDiff'](diff);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('getProxyRelatedUrls', () => {
    it('should return an array of proxy related URLs', () => {
      // Given
      const versionMock = {
        sector_identifier_uri: 'url1',
        jwks_uri: 'url2',
      };

      // When
      const result = handler['getProxyRelatedUrls'](versionMock);

      // Then
      expect(result).toEqual(['url1', 'url2']);
    });

    it('should filter out undefined URLs', () => {
      // Given
      const versionMock = {
        sector_identifier_uri: undefined,
        jwks_uri: 'url2',
      };

      // When
      const result = handler['getProxyRelatedUrls'](versionMock);

      // Then
      expect(result).toEqual(['url2']);
    });
  });
});
