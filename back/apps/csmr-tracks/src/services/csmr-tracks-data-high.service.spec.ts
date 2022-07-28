import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { GeoipMaxmindService } from '@fc/geoip-maxmind';
import { LoggerService } from '@fc/logger-legacy';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { IdpMappings } from '../dto';
import { CsmrTracksTransformTracksFailedException } from '../exceptions';
import {
  ICsmrTracksHighFieldsData,
  ICsmrTracksHighTransformData,
} from '../interfaces';
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
  };

  const configMock = {
    get: jest.fn(),
  };

  const configDataMock: Partial<IdpMappings> = {
    mappings: {
      fiTest: 'fiTestValue',
    },
  };

  const scopesMock = {
    getRichClaimsFromClaims: jest.fn(),
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
        {
          provide: 'ScopesFcpHigh',
          useValue: scopesMock,
        },
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

  describe('getClaimsGroups()', () => {
    it('should return an empty array if no scope are present in source tracks', () => {
      // Given
      const sourceMock = {} as unknown as ICsmrTracksHighTransformData;

      // When
      const claims = service['getClaimsGroups'](sourceMock);

      // Then
      expect(claims).toEqual([]);
    });

    it('should return the return of scopesService.getRichClaimsFromClaims()', () => {
      // Given
      const sourceMock = {
        claims: 'sub gender family_name birthdate birthplace',
      } as unknown as ICsmrTracksHighTransformData;

      const getRichClaimsFromClaimsMockReturnedValue = Symbol(
        'getRichClaimsFromClaimsMockReturnedValue',
      );
      scopesMock.getRichClaimsFromClaims.mockReturnValueOnce(
        getRichClaimsFromClaimsMockReturnedValue,
      );

      // When
      const claims = service['getClaimsGroups'](sourceMock);

      // Then
      expect(claims).toBe(getRichClaimsFromClaimsMockReturnedValue);
    });
  });

  describe('getGeoFromIp()', () => {
    it('should return country and city from geopoint data', () => {
      // Given
      const sourceMock = {
        ip: '172.16.156.25',
        'source.geo.city_name': 'Paris',
        'source.geo.country_iso_code': 'FR',
        'source.geo.region_name': 'Ile-de-France',
      } as unknown as ICsmrTracksHighTransformData;

      const resultMock = {
        country: 'FR',
        city: 'Paris',
      };
      // When
      const geoIp = service['getGeoFromIp'](sourceMock);
      // Then
      expect(geoIp).toStrictEqual(resultMock);
      expect(geoipMaxmindServiceMock.getCityName).toBeCalledTimes(0);
      expect(geoipMaxmindServiceMock.getCountryIsoCode).toBeCalledTimes(0);
    });

    it('should return country and city from geopoint data even if city_name is not defined', () => {
      // Given
      const sourceMock = {
        ip: '172.16.156.25',
        'source.geo.city_name': undefined,
        'source.geo.country_iso_code': 'FR',
        'source.geo.region_name': 'Ile-de-France',
      } as unknown as ICsmrTracksHighTransformData;

      const resultMock = {
        country: 'FR',
        city: 'Ile-de-France',
      };
      // When
      const geoIp = service['getGeoFromIp'](sourceMock);
      // Then
      expect(geoIp).toStrictEqual(resultMock);
      expect(geoipMaxmindServiceMock.getCityName).toBeCalledTimes(0);
      expect(geoipMaxmindServiceMock.getCountryIsoCode).toBeCalledTimes(0);
    });

    it('should return country and city name from local database through geoip service', () => {
      // Given
      const sourceMock = {
        ip: '172.16.156.25',
      } as unknown as ICsmrTracksHighTransformData;

      geoipMaxmindServiceMock.getCityName.mockReturnValueOnce('Paris');
      geoipMaxmindServiceMock.getCountryIsoCode.mockReturnValueOnce('FR');

      const resultMock = {
        country: 'FR',
        city: 'Paris',
      };
      // When
      const geoIp = service['getGeoFromIp'](sourceMock);
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

    it('should return undefined country and city name if geo data are empty', () => {
      // Given
      const sourceMock = {
        ip: '172.16.156.25',
        'source.geo.city_name': undefined,
        'source.geo.country_iso_code': undefined,
      } as unknown as ICsmrTracksHighTransformData;

      geoipMaxmindServiceMock.getCityName.mockReturnValueOnce('Paris');
      geoipMaxmindServiceMock.getCountryIsoCode.mockReturnValueOnce('FR');

      const resultMock = {
        country: 'FR',
        city: 'Paris',
      };
      // When
      const geoIp = service['getGeoFromIp'](sourceMock);
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

    it('should return undefined country and city name if geoip service return undefined variable', () => {
      // Given
      const sourceMock = {
        ip: '172.16.156.25',
      } as unknown as ICsmrTracksHighTransformData;

      geoipMaxmindServiceMock.getCityName.mockReturnValueOnce(undefined);
      geoipMaxmindServiceMock.getCountryIsoCode.mockReturnValueOnce(undefined);

      const resultMock = {
        country: undefined,
        city: undefined,
      };
      // When
      const geoIp = service['getGeoFromIp'](sourceMock);
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
      } as unknown as ICsmrTracksHighTransformData;

      // When
      const label = service['getIdpLabel'](sourceMock);

      // Then
      expect(label).toEqual('idpLabelValue');
    });
    it('should return mapping value from idpName if idpLabel was missing', () => {
      // Given
      const sourceMock = {
        idpName: 'fiTest',
      } as unknown as ICsmrTracksHighTransformData;

      // When
      const label = service['getIdpLabel'](sourceMock);

      // Then
      expect(label).toEqual('fiTestValue');
    });
    it('should return idpName value if neither idpLabel and idpName mappings are unavailable', () => {
      // Given
      const sourceMock = {
        idpName: 'idpNameValue',
      } as unknown as ICsmrTracksHighTransformData;

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

    const sourceMock: ICsmrTracksHighTransformData = Object.freeze({
      'source.geo.city_name': 'Paris',
      'source.geo.country_iso_code': 'FR',
      'source.geo.region_name': 'Ile-de-France',
      spLabel: 'spLabelValue',
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
      time: '1664661600000',
    });

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
      getGeoFromIpMock.mockReturnValueOnce(geoIpDataMock);

      getIdpLabelMock = jest.spyOn<CsmrTracksHighDataService, any>(
        service,
        'getIdpLabel',
      );

      getIdpLabelMock.mockImplementation(({ idpLabel }) => idpLabel);
    });

    it('should transform source to track data', async () => {
      // Given
      const mock = {
        ...sourceMock,
      };

      const resultMock = {
        city: 'Pirate',
        claims: ['sub', 'given_name', 'gender'],
        country: 'PR',
        time: 1664661600000,
        event: 'FC_VERIFIED',
        spAcr: 'eidas1',
        spLabel: 'spLabelValue',
        idpLabel: 'idpLabelValue',
      };

      // When
      const tracks = await service['transformTrack'](mock);
      // Then
      expect(tracks).toStrictEqual(resultMock);
    });
  });

  describe('formattedTracks()', () => {
    let transformTrackMock: jest.SpyInstance;

    const baseMock = {
      'source.geo.city_name': 'Paris',
      'source.geo.country_iso_code': 'FR',
      'source.geo.region_name': 'Ile-de-France',
      spLabel: 'spLabelValue',
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
      time: '0',
    };

    const dataMock: ICsmrTracksHighTransformData[] = [
      {
        ...baseMock,
        event: 'event1',
        time: '1645225200000',
        spId: '42',
        spAcr: 'eidas1',
      },
      {
        ...baseMock,
        event: 'event2',
        time: '1645311600000',
        spId: '43',
        spAcr: 'eidas2',
      },
      {
        ...baseMock,
        event: 'event3',
        time: '1645570800000',
        spId: '44',
        spAcr: 'eidas3',
      },
    ];

    const docMock: ICsmrTracksHighFieldsData[] = [
      {
        ...dataMock[0],
        platform: 'platformValue',
        trackId: 'trackIdValue1',
      },
      {
        ...dataMock[1],
        platform: 'platformValue',
        trackId: 'trackIdValue2',
      },
      {
        ...dataMock[2],
        platform: 'platformValue',
        trackId: 'trackIdValue3',
      },
    ];

    const tracksTransformMock: Partial<ICsmrTracksOutputTrack>[] = [
      {
        time: 1645398000000,
        spLabel: 'spLabelValue',
        spAcr: 'eidas2',
        idpLabel: 'idpLabelValue',
      },
      {
        time: 1645398000000,
        spLabel: 'spLabelValue',
        spAcr: 'eidas2',
        idpLabel: 'idpLabelValue',
      },
      {
        time: 1646002800000,
        spLabel: 'spLabelValue',
        spAcr: 'eidas3',
        idpLabel: 'idpLabelValue',
      },
    ];

    beforeEach(() => {
      transformTrackMock = jest.spyOn(service, 'transformTrack');

      transformTrackMock
        .mockReturnValueOnce(tracksTransformMock[0])
        .mockReturnValueOnce(tracksTransformMock[1])
        .mockReturnValueOnce(tracksTransformMock[2]);
    });

    it('should format tracks from raw tracks', () => {
      // When
      service.formatTracks(docMock);
      // Then
      expect(transformTrackMock).toHaveBeenNthCalledWith(1, dataMock[0]);
      expect(transformTrackMock).toHaveBeenNthCalledWith(2, dataMock[1]);
      expect(transformTrackMock).toHaveBeenNthCalledWith(3, dataMock[2]);
    });

    it('should get track with id and platform from raw data', () => {
      // Given
      const tracksOutputMock: Partial<ICsmrTracksOutputTrack>[] = [
        {
          ...tracksTransformMock[0],
          platform: 'platformValue',
          trackId: 'trackIdValue1',
        },
        {
          ...tracksTransformMock[1],
          platform: 'platformValue',
          trackId: 'trackIdValue2',
        },
        {
          ...tracksTransformMock[2],
          platform: 'platformValue',
          trackId: 'trackIdValue3',
        },
      ];

      // When
      const tracks = service.formatTracks(docMock);
      // Then
      expect(tracks).toStrictEqual(tracksOutputMock);
    });

    it('should throw an exception if tracks transforming failed', () => {
      // Given
      const errorMock = new Error('Unknown Error');
      transformTrackMock.mockReset().mockImplementationOnce(() => {
        throw errorMock;
      });

      // When
      expect(
        () => service.formatTracks(docMock),
        // Then
      ).toThrow(CsmrTracksTransformTracksFailedException);

      expect(loggerMock.trace).toHaveBeenCalledTimes(1);
    });
  });
});
