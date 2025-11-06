import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import {
  getContextFromLegacyTracks,
  getIpAddressFromTracks,
  getLocationFromTracks,
  TracksFormatterMappingFailedException,
  TracksLegacyFieldsInterface,
} from '@fc/tracks-adapter-elasticsearch';

import { getLoggerMock } from '@mocks/logger';

import { IdpMappings } from '../dto';
import { Platform } from '../enums';
import { getReadableDateFromTime } from '../utils';
import { TracksLegacyFormatter } from './tracks-legacy.formatter';

jest.mock('../utils');
jest.mock('@fc/tracks-adapter-elasticsearch/utils');

describe('TracksLegacyFormatter', () => {
  let service: TracksLegacyFormatter;

  const loggerMock = getLoggerMock();

  const configMock = {
    get: jest.fn(),
  };

  const configDataMock: Partial<IdpMappings> = {
    mappings: {
      fiLoggedValue: 'fiMappedValue',
    },
  };

  // Legacy field name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const geoMock = { city_name: 'Paris', country_iso_code: 'FR' };

  const legacyContextMock = {
    spName: 'spName',
    spId: 'spId',
    idpName: 'idpName',
    idpId: 'idpId',
    idpLabel: 'idpLabel',
    idpSub: 'idpSub',
    spSub: 'spSub',
    interactionId: 'interactionId',
    interactionAcr: 'eidas1',
    browsingSessionId: 'browsingSessionId',
  };

  const localisationMock = { city: 'Paris', country: 'FR' };

  const ipAddress = ['ipAddress'];

  const inputMock = {
    _id: 'mockId',
    _source: {
      // Legacy field name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fs_label: 'fs_label',
      time: 166466160,
      fi: 'fi',
      fiLabel: 'fiLabel',
      accountId: 'accountId',
      source: { geo: geoMock, address: ipAddress },
      fiSub: 'idpSub',
      fsSub: 'spSub',
      eidas: 'eidas1',
    },
  } as unknown as SearchHit<TracksLegacyFieldsInterface>;

  const timeMock = new Date(inputMock._source.time).getTime();

  const readableDateMock = '02/10/2022 00:00:00';

  const getIdpLabelMockResult = Symbol('getIdpLabelMockResult');

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [TracksLegacyFormatter, LoggerService, ConfigService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .compile();

    service = module.get<TracksLegacyFormatter>(TracksLegacyFormatter);

    configMock.get.mockReturnValue(configDataMock);

    jest.mocked(getLocationFromTracks).mockReturnValue(localisationMock);
    jest.mocked(getContextFromLegacyTracks).mockReturnValue(legacyContextMock);
    jest.mocked(getIpAddressFromTracks).mockReturnValue(ipAddress);
    jest.mocked(getReadableDateFromTime).mockReturnValue(readableDateMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('formatTrack()', () => {
    beforeEach(() => {
      service['getIdpLabel'] = jest
        .fn()
        .mockReturnValueOnce(getIdpLabelMockResult);
    });

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

    it('should call getReadableDateFromTime() with time', () => {
      // When
      service.formatTrack(inputMock);

      // Then
      expect(getReadableDateFromTime).toHaveBeenCalledExactlyOnceWith(timeMock);
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
      expect(formattedTrack).toStrictEqual({
        id: 'mockId',
        time: timeMock,
        date: readableDateMock,
        spName: legacyContextMock.spName,
        spId: legacyContextMock.spId,
        idpName: legacyContextMock.idpName,
        idpLabel: getIdpLabelMockResult,
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

  describe('getIdpLabel', () => {
    it('should return idpLabel if defined', () => {
      // When
      const label = service['getIdpLabel']('idpLabelMock', 'fiLoggedValue');

      // Then
      expect(label).toEqual('idpLabelMock');
    });

    it('should return mapping value from idpName if present in mapping and id and idpLabel undefined', () => {
      // When
      const label = service['getIdpLabel'](undefined, 'fiLoggedValue');

      // Then
      expect(label).toEqual('fiMappedValue');
    });

    it('should return idpName value if idpName mappings is unavailable and id and idpLabel undefined', () => {
      // When
      const label = service['getIdpLabel'](undefined, 'NonMappedValue');

      // Then
      expect(label).toEqual('NonMappedValue');
    });
  });
});
