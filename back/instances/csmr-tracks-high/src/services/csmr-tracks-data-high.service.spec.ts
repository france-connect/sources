import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { CsmrTracksTransformTracksFailedException } from '@fc/csmr-tracks';
import { GeoipMaxmindService } from '@fc/geoip-maxmind';
import { LoggerService } from '@fc/logger-legacy';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { IdpMappings } from '../dto';
import { accountQueryMock } from '../fixtures';
import { ICsmrTracksHighTrack, ICsmrTracksInputHigh } from '../interfaces';
import { CsmrTracksHighDataService } from './csmr-tracks-data-high.service';

describe('CsmrTracksHighDataService', () => {
  let service: CsmrTracksHighDataService;

  const geoipMaxmindServiceMock = {
    getCityName: jest.fn(),
    getCountryIsoCode: jest.fn(),
  };

  const loggerMock = {
    debug: jest.fn(),
    trace: jest.fn(),
    setContext: jest.fn(),
  } as unknown as LoggerService;

  const configMock = {
    get: jest.fn(),
  };

  const configDataMock: Partial<IdpMappings> = {
    mappings: {
      fiTest: 'fiTestValue',
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsmrTracksHighDataService,
        GeoipMaxmindService,
        LoggerService,
        ConfigService,
      ],
    })
      .overrideProvider(GeoipMaxmindService)
      .useValue(geoipMaxmindServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .compile();

    service = module.get<CsmrTracksHighDataService>(CsmrTracksHighDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set logger context', () => {
    expect(loggerMock.setContext).toHaveBeenCalledTimes(1);
    expect(loggerMock.setContext).toHaveBeenCalledWith(
      'CsmrTracksHighDataService',
    );
  });

  describe('formatQuery()', () => {
    it('should format request with accountId and index', () => {
      const indexMock = 'indexMockValue';
      const accountIdMock = 'accountIdMockValue';
      const request = service.formatQuery(indexMock, accountIdMock);
      expect(request).toStrictEqual(accountQueryMock);
    });
  });

  describe('getClaimsGroups()', () => {
    it('should return null if no scope is present in source tracks', () => {
      // Given
      const sourceMock = {} as unknown as ICsmrTracksHighTrack;

      // When
      const claims = service['getClaimsGroups'](sourceMock);

      // Then
      expect(claims).toBeNull();
    });

    it('should get the claims as array', () => {
      // Given
      const sourceMock = {
        claims: 'sub gender family_name birthdate birthplace',
      } as unknown as ICsmrTracksHighTrack;

      const resultMock = [
        'sub',
        'gender',
        'family_name',
        'birthdate',
        'birthplace',
      ];

      // When
      const claims = service['getClaimsGroups'](sourceMock);

      // Then
      expect(claims).toStrictEqual(resultMock);
    });
  });

  describe('getGeoFromIp()', () => {
    it('should return undefined country and city name if geo object is emtpy', async () => {
      // Given
      const sourceMock = {
        ip: '172.16.156.25',
        source: {
          geo: {},
        },
      } as unknown as ICsmrTracksHighTrack;

      const resultMock = {
        country: undefined,
        city: undefined,
      };
      // When
      const geoIp = await service['getGeoFromIp'](sourceMock);
      // Then
      expect(geoIp).toStrictEqual(resultMock);
      expect(geoipMaxmindServiceMock.getCityName).toBeCalledTimes(0);
      expect(geoipMaxmindServiceMock.getCountryIsoCode).toBeCalledTimes(0);
    });

    it('should return country and city from geopoint data', async () => {
      // Given
      const sourceMock = {
        ip: '172.16.156.25',
        source: {
          geo: {
            // geopoint naming
            // eslint-disable-next-line @typescript-eslint/naming-convention
            city_name: 'Paris',
            // geopoint naming
            // eslint-disable-next-line @typescript-eslint/naming-convention
            country_iso_code: 'FR',
          },
        },
      } as unknown as ICsmrTracksHighTrack;

      const resultMock = {
        country: 'FR',
        city: 'Paris',
      };
      // When
      const geoIp = await service['getGeoFromIp'](sourceMock);
      // Then
      expect(geoIp).toStrictEqual(resultMock);
      expect(geoipMaxmindServiceMock.getCityName).toBeCalledTimes(0);
      expect(geoipMaxmindServiceMock.getCountryIsoCode).toBeCalledTimes(0);
    });

    it('should return country and city from geopoint data even if city_name is not defined', async () => {
      // Given
      const sourceMock = {
        ip: '172.16.156.25',
        source: {
          geo: {
            // geopoint naming
            // eslint-disable-next-line @typescript-eslint/naming-convention
            region_name: 'Ile-de-France',
            // geopoint naming
            // eslint-disable-next-line @typescript-eslint/naming-convention
            country_iso_code: 'FR',
          },
        },
      } as unknown as ICsmrTracksHighTrack;

      const resultMock = {
        country: 'FR',
        city: 'Ile-de-France',
      };
      // When
      const geoIp = await service['getGeoFromIp'](sourceMock);
      // Then
      expect(geoIp).toStrictEqual(resultMock);
      expect(geoipMaxmindServiceMock.getCityName).toBeCalledTimes(0);
      expect(geoipMaxmindServiceMock.getCountryIsoCode).toBeCalledTimes(0);
    });

    it('should return country and city name from local database through geoip service', async () => {
      // Given
      const sourceMock = {
        ip: '172.16.156.25',
      } as unknown as ICsmrTracksHighTrack;

      geoipMaxmindServiceMock.getCityName.mockReturnValueOnce('Paris');
      geoipMaxmindServiceMock.getCountryIsoCode.mockReturnValueOnce('FR');

      const resultMock = {
        country: 'FR',
        city: 'Paris',
      };
      // When
      const geoIp = await service['getGeoFromIp'](sourceMock);
      // Then
      expect(geoIp).toStrictEqual(resultMock);
      expect(geoipMaxmindServiceMock.getCityName).toBeCalledTimes(1);
      expect(geoipMaxmindServiceMock.getCityName).toBeCalledWith(
        '172.16.156.25',
      );
      expect(geoipMaxmindServiceMock.getCountryIsoCode).toBeCalledTimes(1);
      expect(geoipMaxmindServiceMock.getCountryIsoCode).toBeCalledWith(
        '172.16.156.25',
      );
    });

    it('should return undefined country and city name if geoip service return undefined variable', async () => {
      // Given
      const sourceMock = {
        ip: '172.16.156.25',
      } as unknown as ICsmrTracksHighTrack;

      geoipMaxmindServiceMock.getCityName.mockReturnValueOnce(undefined);
      geoipMaxmindServiceMock.getCountryIsoCode.mockReturnValueOnce(undefined);

      const resultMock = {
        country: undefined,
        city: undefined,
      };
      // When
      const geoIp = await service['getGeoFromIp'](sourceMock);
      // Then
      expect(geoIp).toStrictEqual(resultMock);
      expect(geoipMaxmindServiceMock.getCityName).toBeCalledTimes(1);
      expect(geoipMaxmindServiceMock.getCityName).toBeCalledWith(
        '172.16.156.25',
      );
      expect(geoipMaxmindServiceMock.getCountryIsoCode).toBeCalledTimes(1);
      expect(geoipMaxmindServiceMock.getCountryIsoCode).toBeCalledWith(
        '172.16.156.25',
      );
    });
  });

  describe('getIdpLabel', () => {
    beforeEach(() => {
      configMock.get.mockReturnValueOnce(configDataMock);
    });

    it('should return idpLabel if data exist on source', () => {
      // Given
      const sourceMock = {
        idpLabel: 'idpLabelValue',
      } as unknown as ICsmrTracksHighTrack;

      // When
      const label = service['getIdpLabel'](sourceMock);

      // Then
      expect(label).toEqual('idpLabelValue');
    });
    it('should return mapping value from idpName if idpLabel was missing', () => {
      // Given
      const sourceMock = {
        idpName: 'fiTest',
      } as unknown as ICsmrTracksHighTrack;

      // When
      const label = service['getIdpLabel'](sourceMock);

      // Then
      expect(label).toEqual('fiTestValue');
    });
    it('should return idpName value if neither idpLabel and idpName mappings are unavailable', () => {
      // Given
      const sourceMock = {
        idpName: 'idpNameValue',
      } as unknown as ICsmrTracksHighTrack;

      // When
      const label = service['getIdpLabel'](sourceMock);

      // Then
      expect(label).toEqual('idpNameValue');
    });
  });

  describe('transformTrack()', () => {
    let getClaimsGroupsMock: jest.SpyInstance;
    let getGeoFromIpMock: jest.SpyInstance;
    let getIdpLabelMock: jest.SpyInstance;

    const claimsMock = ['sub', 'given_name', 'gender'];
    const geoIpDataMock = {
      country: 'PR',
      city: 'Pirate',
    };

    beforeEach(() => {
      getClaimsGroupsMock = jest.spyOn<CsmrTracksHighDataService, any>(
        service,
        'getClaimsGroups',
      );
      getClaimsGroupsMock.mockReturnValueOnce(claimsMock);

      getGeoFromIpMock = jest.spyOn<CsmrTracksHighDataService, any>(
        service,
        'getGeoFromIp',
      );
      getGeoFromIpMock.mockResolvedValueOnce(geoIpDataMock);

      getIdpLabelMock = jest.spyOn<CsmrTracksHighDataService, any>(
        service,
        'getIdpLabel',
      );

      getIdpLabelMock.mockImplementation(({ idpLabel }) => idpLabel);
    });

    it('should transform source to track data', async () => {
      // Given
      const sourceMock: ICsmrTracksHighTrack = {
        category: ' categoryValue',
        step: 'stepValue',
        idpId: 'idpIdValue',
        idpAcr: 'idpAcrValue',
        idpLabel: 'idpLabelValue',

        ip: '172.168.2.2',
        accountId: 'accountIdValue',
        spSub: 'spSubValue',
        idpSub: 'idpSubValue',
        interactionId: 'interactionIdValue',
        level: 'info',
        pid: 42,
        hostname: 'fakeFranceConnect',
        logId: 'logIdValue',
        '@version': '@versionValue',
        spName: 'spNameValue',
        idpName: 'idpNameValue',
        event: 'FC_VERIFIED',
        spId: 'spIdValue',
        spAcr: 'eidas1',
        time: 1664661600000,
      };

      const resultMock = {
        city: 'Pirate',
        claims: ['sub', 'given_name', 'gender'],
        country: 'PR',
        time: 1664661600000,
        event: 'FC_VERIFIED',
        spAcr: 'eidas1',
        spLabel: 'spNameValue',
        idpLabel: 'idpLabelValue',
      };

      // When
      const tracks = await service['transformTrack'](sourceMock);
      // Then
      expect(tracks).toStrictEqual(resultMock);
    });
  });

  describe('formattedTracks()', () => {
    const baseMock: ICsmrTracksInputHigh = {
      _index: 'fc',
      _type: 'doc',
      _id: 'xxzxzxzd4z5dz5',
      _score: 1,
      _source: {
        category: ' categoryValue',
        step: 'stepValue',
        idpId: 'idpIdValue',
        idpAcr: 'idpAcrValue',
        idpLabel: 'idpLabelValue',

        ip: '172.168.2.2',
        accountId: 'accountIdValue',
        spSub: 'spSubValue',
        idpSub: 'idpSubValue',
        interactionId: 'interactionIdValue',
        level: 'info',
        pid: 42,
        hostname: 'fakeFranceConnect',
        logId: 'logIdValue',
        '@version': '@versionValue',
        spName: 'spNameValue',
        idpName: 'idpNameValue',

        event: 'shouldBeChanged',
        spId: 'shouldBeChanged',
        spAcr: 'shouldBeChanged',
        time: 0,
      },
    };

    const rawTracksMock: ICsmrTracksInputHigh[] = [
      {
        ...baseMock,
        _source: {
          ...baseMock._source,
          event: 'event1',
          time: 1645225200000,
          spId: '42',
          spAcr: 'eidas1',
        },
      },
      {
        ...baseMock,
        _source: {
          ...baseMock._source,
          event: 'event2',
          time: 1645311600000,
          spId: '43',
          spAcr: 'eidas2',
        },
      },

      {
        ...baseMock,
        _source: {
          ...baseMock._source,
          event: 'event3',
          time: 1645570800000,
          spId: '44',
          spAcr: 'eidas3',
        },
      },
    ];

    let transformTrackMock: jest.SpyInstance;

    beforeEach(() => {
      transformTrackMock = jest.spyOn(service, 'transformTrack');
    });

    it('should format tracks from raw tracks', async () => {
      // Given

      const resultMock: ICsmrTracksOutputTrack = {
        event: 'shouldBeChanged',
        time: 0,
        city: 'cityValue',
        claims: null,
        country: 'countryValue',
        idpLabel: 'idpLabelValue',
        platform: 'FranceConnect+',
        spAcr: 'eidas1',
        spLabel: 'spNameValue',
        trackId: 'xxzxzxzd4z5dz5',
      };

      const tracksOutputMock: ICsmrTracksOutputTrack[] = [
        {
          ...resultMock,
          event: 'event1',
          spAcr: 'eidas1',
          time: 1645225200000,
        },
        {
          ...resultMock,
          event: 'event2',
          spAcr: 'eidas2',
          time: 1645311600000,
        },
        {
          ...resultMock,
          event: 'event3',
          spAcr: 'eidas3',
          time: 1645570800000,
        },
      ];

      transformTrackMock
        .mockResolvedValueOnce(tracksOutputMock[0])
        .mockResolvedValueOnce(tracksOutputMock[1])
        .mockResolvedValueOnce(tracksOutputMock[2]);
      // When
      const tracks = await service.formattedTracks(rawTracksMock);
      // Then
      expect(tracks).toStrictEqual(tracksOutputMock);
      expect(transformTrackMock).toHaveBeenNthCalledWith(
        1,
        rawTracksMock[0]._source,
      );
      expect(transformTrackMock).toHaveBeenNthCalledWith(
        2,
        rawTracksMock[1]._source,
      );
      expect(transformTrackMock).toHaveBeenNthCalledWith(
        3,
        rawTracksMock[2]._source,
      );
    });

    it('should throw an exception if tracks transforming failed', async () => {
      // Given
      const errorMock = new Error('Unknown Error');
      transformTrackMock.mockRejectedValue(errorMock);

      await expect(
        // When
        service.formattedTracks(rawTracksMock),
        // Then
      ).rejects.toThrow(CsmrTracksTransformTracksFailedException);

      expect(loggerMock.trace).toHaveBeenCalledTimes(1);
    });
  });
});
