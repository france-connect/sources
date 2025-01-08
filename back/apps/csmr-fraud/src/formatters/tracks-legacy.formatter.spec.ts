import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';
import {
  getContextFromLegacyTracks,
  getIpAddressFromTracks,
  getLocationFromTracks,
  TracksFormatterMappingFailedException,
  TracksLegacyFieldsInterface,
} from '@fc/tracks-adapter-elasticsearch';

import { getLoggerMock } from '@mocks/logger';

import { Platform } from '../enums';
import { getReadableDateFromTime } from '../utils';
import { TracksLegacyFormatter } from './tracks-legacy.formatter';

jest.mock('../utils');
jest.mock('@fc/tracks-adapter-elasticsearch/utils');

describe('TracksLegacyFormatter', () => {
  let service: TracksLegacyFormatter;

  const loggerMock = getLoggerMock();

  const readableDateMock = '11/11/2024 11:11:11';

  // Legacy field name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const geoMock = { city_name: 'Paris', country_iso_code: 'FR' };

  const legacyContextMock = {
    spName: 'spName',
    idpName: 'idpName',
    idpSub: 'idpSub',
    spSub: 'spSub',
    interactionAcr: 'eidas1',
  };

  const localisationMock = { city: 'Paris', country: 'FR' };

  const ipAddress = ['ipAddress'];

  const inputMock = {
    _source: {
      // Legacy field name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fs_label: 'fs_label',
      time: 1731319871,
      fi: 'fi',
      accountId: 'accountId',
      source: { geo: geoMock, address: ipAddress },
      fiSub: 'idpSub',
      fsSub: 'spSub',
      eidas: 'eidas1',
    },
  } as unknown as SearchHit<TracksLegacyFieldsInterface>;

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [TracksLegacyFormatter, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<TracksLegacyFormatter>(TracksLegacyFormatter);

    jest.mocked(getReadableDateFromTime).mockReturnValue(readableDateMock);
    jest.mocked(getLocationFromTracks).mockReturnValue(localisationMock);
    jest.mocked(getContextFromLegacyTracks).mockReturnValue(legacyContextMock);
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

    it('should call getReadableDateFromTime() with time', () => {
      // When
      service.formatTrack(inputMock);

      // Then
      expect(getReadableDateFromTime).toHaveBeenCalledTimes(1);
      expect(getReadableDateFromTime).toHaveBeenCalledWith(
        inputMock._source.time,
      );
    });

    it('should call getContextFromLegacyTracks() with _source', () => {
      // When
      service.formatTrack(inputMock);

      // Then
      expect(getContextFromLegacyTracks).toHaveBeenCalledTimes(1);
      expect(getContextFromLegacyTracks).toHaveBeenCalledWith(
        inputMock._source,
      );
    });

    it('should call getIpAddressFromTracks() with _source', () => {
      // When
      service.formatTrack(inputMock);

      // Then
      expect(getIpAddressFromTracks).toHaveBeenCalledTimes(1);
      expect(getIpAddressFromTracks).toHaveBeenCalledWith(inputMock._source);
    });

    it('should return formatted track', () => {
      // When
      const formattedTrack = service.formatTrack(inputMock);

      // Then
      expect(formattedTrack).toEqual({
        date: readableDateMock,
        spName: legacyContextMock.spName,
        idpName: legacyContextMock.idpName,
        country: localisationMock.country,
        city: localisationMock.city,
        platform: Platform.FCP_LEGACY,
        accountId: 'accountId',
        idpSub: 'idpSub',
        spSub: 'spSub',
        interactionAcr: 'eidas1',
        ipAddress,
      });
    });

    it('should throw an exception if an error occurs', () => {
      const errorMock = new Error('error');

      jest.mocked(getReadableDateFromTime).mockImplementationOnce(() => {
        throw errorMock;
      });

      // When
      expect(() => service.formatTrack(inputMock)).toThrow(
        new TracksFormatterMappingFailedException(errorMock),
      );
    });
  });
});
