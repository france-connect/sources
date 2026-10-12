import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';
import {
  CoreInstance,
  getIpAddressFromTracks,
  getLocationFromTracks,
  getOrganizationFromTracks,
  getPortFromTracks,
  TracksFormatterMappingFailedException,
  TracksV2FieldsInterface,
} from '@fc/tracks-adapter-elasticsearch';

import { getLoggerMock } from '@mocks/logger';

import { Platform } from '../enums';
import { getReadableDateFromTime } from '../utils';
import { TracksV2Formatter } from './tracks-v2.formatter';

jest.mock('../utils');
jest.mock('@fc/tracks-adapter-elasticsearch/utils');

describe('TracksV2Formatter', () => {
  let service: TracksV2Formatter;

  const loggerMock = getLoggerMock();

  // Legacy field name
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const geoMock = { city_name: 'Paris', country_iso_code: 'FR' };

  const localisationMock = {
    city: 'Paris',
    region: 'Île-de-France',
    country: 'FR',
  };

  const platformMock = Platform.FCP_LOW;

  const ipAddress = ['ipAddress'];
  const port = '45826';
  const organization = 'OVH SAS';

  const timeMock = 1664661600000;

  const readableDateMock = '02/10/2022 00:00:00';

  const inputMock = {
    _id: 'mockId',
    _source: {
      idpName: 'idpNameMock',
      idpId: 'idpIdMock',
      idpLabel: 'idpLabelMock',
      spName: 'spNameMock',
      spId: 'spIdMock',
      time: timeMock,
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
    jest.mocked(getPortFromTracks).mockReturnValue(port);
    jest.mocked(getOrganizationFromTracks).mockReturnValue(organization);
    jest.mocked(getReadableDateFromTime).mockReturnValue(readableDateMock);
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

    it('should call getPortFromTracks() with _source', () => {
      // When
      service.formatTrack(inputMock);

      // Then
      expect(getPortFromTracks).toHaveBeenCalledTimes(1);
      expect(getPortFromTracks).toHaveBeenCalledWith(inputMock._source);
    });

    it('should call getOrganizationFromTracks() with _source', () => {
      // When
      service.formatTrack(inputMock);

      // Then
      expect(getOrganizationFromTracks).toHaveBeenCalledTimes(1);
      expect(getOrganizationFromTracks).toHaveBeenCalledWith(inputMock._source);
    });

    it('should call getReadableDateFromTime() with time', () => {
      // When
      service.formatTrack(inputMock);

      // Then
      expect(getReadableDateFromTime).toHaveBeenCalledExactlyOnceWith(timeMock);
    });

    it('should use spAcr if interactionAcr is not set', () => {
      // Given
      const inputWithoutInteractionAcrMock = {
        _id: inputMock._id,
        _source: {
          ...inputMock._source,
          interactionAcr: undefined,
        },
      } as SearchHit<TracksV2FieldsInterface>;

      const resultMock = {
        id: 'mockId',
        country: localisationMock.country,
        city: localisationMock.city,
        region: localisationMock.region,
        time: timeMock,
        date: readableDateMock,
        spName: 'spNameMock',
        spId: 'spIdMock',
        idpName: 'idpNameMock',
        idpLabel: 'idpLabelMock',
        idpId: 'idpIdMock',
        platform: platformMock,
        accountId: 'accountIdMock',
        idpSub: 'idpSubMock',
        spSub: 'spSubMock',
        interactionId: 'interactionIdMock',
        interactionAcr: 'spAcrMock',
        browsingSessionId: 'browsingSessionIdMock',
        ipAddress,
        port,
        organization,
      };

      // When
      const tracks = service.formatTrack(inputWithoutInteractionAcrMock);

      // Then
      expect(tracks).toStrictEqual(resultMock);
    });

    it('should transform source to track data', () => {
      // Given
      const resultMock = {
        id: 'mockId',
        country: localisationMock.country,
        city: localisationMock.city,
        region: localisationMock.region,
        time: timeMock,
        date: readableDateMock,
        spName: 'spNameMock',
        spId: 'spIdMock',
        idpName: 'idpNameMock',
        idpLabel: 'idpLabelMock',
        idpId: 'idpIdMock',
        platform: platformMock,
        accountId: 'accountIdMock',
        idpSub: 'idpSubMock',
        spSub: 'spSubMock',
        interactionId: 'interactionIdMock',
        interactionAcr: 'interactionAcrMock',
        browsingSessionId: 'browsingSessionIdMock',
        ipAddress,
        port,
        organization,
      };

      // When
      const tracks = service.formatTrack(inputMock);

      // Then
      expect(tracks).toStrictEqual(resultMock);
    });

    it('should keep optional technical fields as empty strings when missing', () => {
      // Given
      jest.mocked(getLocationFromTracks).mockReturnValue({
        city: localisationMock.city,
        country: localisationMock.country,
        region: undefined,
      });
      jest.mocked(getPortFromTracks).mockReturnValue(undefined);
      jest.mocked(getOrganizationFromTracks).mockReturnValue(undefined);

      // When
      const tracks = service.formatTrack(inputMock);

      // Then
      expect(tracks).toEqual(
        expect.objectContaining({
          region: '',
          port: '',
          organization: '',
        }),
      );
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
