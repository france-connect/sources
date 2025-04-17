import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';
import {
  CoreInstance,
  getIpAddressFromTracks,
  getLocationFromTracks,
  TracksFormatterMappingFailedException,
  TracksV2FieldsInterface,
} from '@fc/tracks-adapter-elasticsearch';

import { getLoggerMock } from '@mocks/logger';

import { Platform } from '../enums';
import { TracksV2Formatter } from './tracks-v2.formatter';

jest.mock('../utils');
jest.mock('@fc/tracks-adapter-elasticsearch/utils');

describe('TracksV2Formatter', () => {
  let service: TracksV2Formatter;

  const loggerMock = getLoggerMock();

  // Legacy field name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const geoMock = { city_name: 'Paris', country_iso_code: 'FR' };

  const localisationMock = { city: 'Paris', country: 'FR' };

  const platformMock = Platform.FCP_LOW;

  const ipAddress = ['ipAddress'];

  const inputMock = {
    _source: {
      idpName: 'idpNameMock',
      idpId: 'idpIdMock',
      spName: 'spNameMock',
      spId: 'spIdMock',
      time: 1664661600000,
      accountId: 'accountIdMock',
      service: CoreInstance.FCP_LOW,
      idpSub: 'idpSubMock',
      spSub: 'spSubMock',
      interactionAcr: 'interactionAcrMock',
      interactionId: 'interactionIdMock',
      browsingSessionId: 'browsingSessionIdMock',
      spAcr: 'spAcrMock',
      source: { geo: geoMock, address: ipAddress },
    },
  } as SearchHit<TracksV2FieldsInterface>;

  @Injectable()
  class TestService extends TracksV2Formatter {
    constructor(protected readonly logger: LoggerService) {
      super(logger, platformMock);
    }
  }

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [TestService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<TestService>(TestService);

    jest.mocked(getLocationFromTracks).mockReturnValue(localisationMock);
    jest.mocked(getIpAddressFromTracks).mockReturnValue(ipAddress);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('formatTrack()', () => {
    it('should call getLocationFromTracks() with _source', () => {
      // When
      service.formatTrack(inputMock);

      // Then
      expect(getLocationFromTracks).toHaveBeenCalledTimes(1);
      expect(getLocationFromTracks).toHaveBeenCalledWith(inputMock._source);
    });

    it('should call getIpAddressFromTracks() with _source', () => {
      // When
      service.formatTrack(inputMock);

      // Then
      expect(getIpAddressFromTracks).toHaveBeenCalledTimes(1);
      expect(getIpAddressFromTracks).toHaveBeenCalledWith(inputMock._source);
    });

    it('should use spAcr if interactionAcr is not set', () => {
      // Given
      const inputWithoutInteractionAcrMock = {
        _source: {
          ...inputMock._source,
          interactionAcr: undefined,
        },
      } as SearchHit<TracksV2FieldsInterface>;

      const resultMock = {
        country: localisationMock.country,
        city: localisationMock.city,
        time: 1664661600000,
        spName: 'spNameMock',
        spId: 'spIdMock',
        idpName: 'idpNameMock',
        idpId: 'idpIdMock',
        platform: platformMock,
        accountId: 'accountIdMock',
        idpSub: 'idpSubMock',
        spSub: 'spSubMock',
        interactionId: 'interactionIdMock',
        interactionAcr: 'spAcrMock',
        browsingSessionId: 'browsingSessionIdMock',
        ipAddress,
      };

      // When
      const tracks = service.formatTrack(inputWithoutInteractionAcrMock);

      // Then
      expect(tracks).toStrictEqual(resultMock);
    });

    it('should transform source to track data', () => {
      // Given
      const resultMock = {
        country: localisationMock.country,
        city: localisationMock.city,
        time: 1664661600000,
        spName: 'spNameMock',
        spId: 'spIdMock',
        idpName: 'idpNameMock',
        idpId: 'idpIdMock',
        platform: platformMock,
        accountId: 'accountIdMock',
        idpSub: 'idpSubMock',
        spSub: 'spSubMock',
        interactionId: 'interactionIdMock',
        interactionAcr: 'interactionAcrMock',
        browsingSessionId: 'browsingSessionIdMock',
        ipAddress,
      };

      // When
      const tracks = service.formatTrack(inputMock);

      // Then
      expect(tracks).toStrictEqual(resultMock);
    });

    it('should throw an error if an error occured', () => {
      // Given
      const errorMock = new Error('Test');
      jest.mocked(getLocationFromTracks).mockImplementation(() => {
        throw errorMock;
      });

      // Then / When
      expect(() => service.formatTrack(inputMock)).toThrow(
        new TracksFormatterMappingFailedException(errorMock),
      );
    });
  });
});
