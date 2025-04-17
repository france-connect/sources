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
import { TracksLegacyFormatter } from './tracks-legacy.formatter';

jest.mock('../utils');
jest.mock('@fc/tracks-adapter-elasticsearch/utils');

describe('TracksLegacyFormatter', () => {
  let service: TracksLegacyFormatter;

  const loggerMock = getLoggerMock();

  // Legacy field name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const geoMock = { city_name: 'Paris', country_iso_code: 'FR' };

  const legacyContextMock = {
    spName: 'spName',
    spId: 'spId',
    idpName: 'idpName',
    idpId: 'idpId',
    idpSub: 'idpSub',
    spSub: 'spSub',
    interactionId: 'interactionId',
    interactionAcr: 'eidas1',
    browsingSessionId: 'browsingSessionId',
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

  const timeMock = new Date(inputMock._source.time).getTime();

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
        time: timeMock,
        spName: legacyContextMock.spName,
        spId: legacyContextMock.spId,
        idpName: legacyContextMock.idpName,
        idpId: legacyContextMock.idpId,
        country: localisationMock.country,
        city: localisationMock.city,
        platform: Platform.FCP_LEGACY,
        accountId: 'accountId',
        idpSub: 'idpSub',
        spSub: 'spSub',
        interactionId: legacyContextMock.interactionId,
        interactionAcr: 'eidas1',
        browsingSessionId: legacyContextMock.browsingSessionId,
        ipAddress,
      });
    });

    it('should throw an exception if an error occurs', () => {
      const errorMock = new Error('error');

      jest.mocked(getLocationFromTracks).mockImplementationOnce(() => {
        throw errorMock;
      });

      // When
      expect(() => service.formatTrack(inputMock)).toThrow(
        new TracksFormatterMappingFailedException(errorMock),
      );
    });
  });
});
