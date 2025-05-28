import { Test, TestingModule } from '@nestjs/testing';

import { PublicationStatusEnum } from '@entities/typeorm';

import { ConfigService } from '@fc/config';
import { diffKeys } from '@fc/config-abstract-adapter';
import { ConfigPublishedEvent } from '@fc/csmr-config';
import { ConfigPublishedEventPropertiesInterface } from '@fc/csmr-config/interfaces';
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
  } as unknown as ConfigPublishedEventPropertiesInterface;

  const eventMock = new ConfigPublishedEvent(messageMock);

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
      handler['updatePartner'] = jest.fn();
    });

    it('should call updateProxy and updatePartner', async () => {
      // Given
      configMock.get.mockReturnValue({
        updateProxy: true,
      });

      // When
      await handler.handle(eventMock);

      // Then
      expect(handler['updateProxy']).toHaveBeenCalledExactlyOnceWith(eventMock);
      expect(handler['updatePartner']).toHaveBeenCalledExactlyOnceWith(
        eventMock,
      );
    });

    it('should call only updatePartner', async () => {
      // Given
      await handler.handle(eventMock);

      // When
      expect(handler['updateProxy']).not.toHaveBeenCalled();
      expect(handler['updatePartner']).toHaveBeenCalledExactlyOnceWith(
        eventMock,
      );
    });
  });

  describe('updatePartner', () => {
    it('should publish a message to the config partners', async () => {
      // When
      await handler['updatePartner'](eventMock);

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

  describe('updateProxy', () => {
    it('should broadcast a message to the proxy', async () => {
      // Given
      const urlsMock = ['url1', 'url2'];
      handler['getProxyRelatedUrls'] = jest.fn().mockReturnValue(urlsMock);
      handler['hasProxyRelatedDiff'] = jest.fn().mockReturnValue(true);

      // When
      await handler['updateProxy'](eventMock);

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
      await handler['updateProxy'](eventMock);

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
