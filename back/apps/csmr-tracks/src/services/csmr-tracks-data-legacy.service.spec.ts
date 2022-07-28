import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { GeoipMaxmindService } from '@fc/geoip-maxmind';
import { LoggerService } from '@fc/logger-legacy';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { IdpMappings } from '../dto';
import {
  CsmrTracksTransformTracksFailedException,
  CsmrTracksUnknownActionException,
} from '../exceptions';
import {
  ICsmrTracksLegacyFieldsData,
  ICsmrTracksLegacyTransformData,
} from '../interfaces';
import { CsmrTracksLegacyDataService } from './csmr-tracks-data-legacy.service';

describe('CsmrTracksLegacyDataService', () => {
  let service: CsmrTracksLegacyDataService;

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
      fiLoggedValue: 'fiMappedValue',
    },
  };

  const scopesMock = {
    getRichClaimsFromScopes: jest.fn(),
  };

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsmrTracksLegacyDataService,
        ConfigService,
        GeoipMaxmindService,
        LoggerService,
        {
          provide: 'ScopesFcLegacy',
          useValue: scopesMock,
        },
      ],
    })
      .overrideProvider(GeoipMaxmindService)
      .useValue(geoipMaxmindServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<CsmrTracksLegacyDataService>(
      CsmrTracksLegacyDataService,
    );

    configMock.get.mockReturnValue(configDataMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set logger context', () => {
    expect(loggerMock.setContext).toHaveBeenCalledTimes(1);
    expect(loggerMock.setContext).toHaveBeenCalledWith(
      'CsmrTracksLegacyDataService',
    );
  });

  describe('getEventFromAction()', () => {
    it('should convert action and type_action to corev2 event', () => {
      // Given
      const sourceMock = {
        action: 'checkedToken',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        type_action: 'verification',
      } as unknown as ICsmrTracksLegacyTransformData;
      const resultMock = 'DP_REQUESTED_FC_CHECKTOKEN';
      // When
      const event = service['getEventFromAction'](sourceMock);
      // Then
      expect(event).toEqual(resultMock);
    });
    it('should throw an exception if action and type_action are unknown', () => {
      // Given
      const sourceMock = {
        action: 'Sarah',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        type_action: 'Connor',
      } as unknown as ICsmrTracksLegacyTransformData;

      expect(
        // When
        () => service['getEventFromAction'](sourceMock),
        // Then
      ).toThrow(CsmrTracksUnknownActionException);
    });
  });

  describe('getClaimsGroups()', () => {
    it('should return an empty array if no scope are present in source tracks', () => {
      // Given
      const sourceMock = {} as unknown as ICsmrTracksLegacyTransformData;

      // When
      const claims = service['getClaimsGroups'](sourceMock);

      // Then
      expect(claims).toEqual([]);
    });

    it('should get the claims from scopes', () => {
      // Given
      const sourceMock = {
        scopes: 'gender, family_name, birth, sub',
      } as unknown as ICsmrTracksLegacyTransformData;

      const resultMock = [
        'sub',
        'gender',
        'family_name',
        'birthdate',
        'birthplace',
      ];

      scopesMock.getRichClaimsFromScopes.mockReturnValueOnce(resultMock);

      // When
      const claims = service['getClaimsGroups'](sourceMock);

      // Then
      expect(claims).toStrictEqual(resultMock);
      expect(scopesMock.getRichClaimsFromScopes).toHaveBeenCalledTimes(1);
      expect(scopesMock.getRichClaimsFromScopes).toHaveBeenCalledWith([
        'gender',
        'family_name',
        'birth',
        'sub',
      ]);
    });
  });

  describe('getAcrValue()', () => {
    const eidasMock = 'eidas3';
    it('should get eidas value from number', () => {
      // Given
      const sourceMock = {
        eidas: 3,
      } as unknown as ICsmrTracksLegacyTransformData;

      // When
      const acrValue = service['getAcrValue'](sourceMock);
      // Then
      expect(acrValue).toEqual(eidasMock);
    });
    it('should get eidas value from number as string', () => {
      // Given
      const sourceMock = {
        eidas: '3',
      } as unknown as ICsmrTracksLegacyTransformData;

      // When
      const acrValue = service['getAcrValue'](sourceMock);
      // Then
      expect(acrValue).toEqual(eidasMock);
    });

    it('should get eidas value from track data', () => {
      // Given
      const sourceMock = {
        eidas: 'eidas3',
      } as unknown as ICsmrTracksLegacyTransformData;

      // When
      const acrValue = service['getAcrValue'](sourceMock);
      // Then
      expect(acrValue).toEqual(eidasMock);
    });

    it('should get eidas1 value if eidas is missing', () => {
      // Given
      const sourceMock = {} as unknown as ICsmrTracksLegacyTransformData;

      // When
      const acrValue = service['getAcrValue'](sourceMock);
      // Then
      expect(acrValue).toEqual('eidas1');
    });
  });

  describe('getGeoFromIp()', () => {
    it('should return country and city from geopoint data', () => {
      // Given
      const sourceMock = {
        userIp: '172.16.156.25',
        'source.geo.city_name': 'Paris',
        'source.geo.country_iso_code': 'FR',
        'source.geo.region_name': 'Ile-de-France',
      } as unknown as ICsmrTracksLegacyTransformData;

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
        userIp: '172.16.156.25',
        'source.geo.city_name': undefined,
        'source.geo.country_iso_code': 'FR',
        'source.geo.region_name': 'Ile-de-France',
      } as unknown as ICsmrTracksLegacyTransformData;

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
        userIp: '172.16.156.25',
      } as unknown as ICsmrTracksLegacyTransformData;

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
        userIp: '172.16.156.25',
        'source.geo.city_name': undefined,
        'source.geo.country_iso_code': undefined,
      } as unknown as ICsmrTracksLegacyTransformData;

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

    it('should return undefined country and city name if geoip service return undefined variable', async () => {
      // Given
      const sourceMock = {
        userIp: '172.16.156.25',
      } as unknown as ICsmrTracksLegacyTransformData;

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
    it('should return mapping value from idpName if present in mapping', () => {
      // Given
      const sourceMock = {
        fi: 'fiLoggedValue',
      } as ICsmrTracksLegacyTransformData;

      // When
      const label = service['getIdpLabel'](sourceMock);

      // Then
      expect(label).toEqual('fiMappedValue');
    });

    it('should return idpName value if idpName mappings is unavailable', () => {
      // Given
      const sourceMock = {
        fi: 'NonMappedValue',
      } as ICsmrTracksLegacyTransformData;

      // When
      const label = service['getIdpLabel'](sourceMock);

      // Then
      expect(label).toEqual('NonMappedValue');
    });
  });

  describe('transformTrack()', () => {
    let getAcrValueMock: jest.SpyInstance;
    let getEventFromActionMock: jest.SpyInstance;
    let getClaimsGroupsMock: jest.SpyInstance;
    let getGeoFromIpMock: jest.SpyInstance;

    const acrValueMock = 'eidas1';
    const eventMock = 'FC_VERIFIED';
    const claimsMock = ['sub', 'given_name', 'gender'];
    const geoIpDataMock = {
      country: 'PR',
      city: 'Pirate',
    };

    const sourceMock: ICsmrTracksLegacyTransformData = Object.freeze({
      'source.geo.city_name': 'Paris',
      'source.geo.country_iso_code': 'FR',
      'source.geo.region_name': 'Ile-de-France',
      spLabel: 'spLabelValue',
      name: 'nameValue',
      fiId: 'fiIdValue',
      fiSub: 'fiSubValue',
      fsId: 'fsId',
      fsSub: 'fsSub',
      scopes: 'gender family_name birth',
      userIp: '172.16.3.1, 172.16.2.6',
      action: 'authentication',
      // legacy log field
      // eslint-disable-next-line @typescript-eslint/naming-convention
      type_action: 'initial',
      fi: 'fiLoggedValue',
      // legacy log field
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fs_label: 'fsLabelValue',
      eidas: 'eidas1',
      time: '1664668800000',
    });

    beforeEach(() => {
      getAcrValueMock = jest.spyOn<CsmrTracksLegacyDataService, any>(
        service,
        'getAcrValue',
      );
      getAcrValueMock.mockReturnValueOnce(acrValueMock);

      getEventFromActionMock = jest.spyOn<CsmrTracksLegacyDataService, any>(
        service,
        'getEventFromAction',
      );
      getEventFromActionMock.mockReturnValueOnce(eventMock);

      getClaimsGroupsMock = jest.spyOn<CsmrTracksLegacyDataService, any>(
        service,
        'getClaimsGroups',
      );
      getClaimsGroupsMock.mockReturnValueOnce(claimsMock);

      getGeoFromIpMock = jest.spyOn<CsmrTracksLegacyDataService, any>(
        service,
        'getGeoFromIp',
      );
      getGeoFromIpMock.mockReturnValueOnce(geoIpDataMock);
    });

    it('should transform source to track data', () => {
      // Given

      const mock = {
        ...sourceMock,
      };

      const resultMock = {
        city: 'Pirate',
        claims: ['sub', 'given_name', 'gender'],
        country: 'PR',
        time: 1664668800000,
        event: 'FC_VERIFIED',
        spAcr: 'eidas1',
        spLabel: 'spLabelValue',
        idpLabel: 'fiMappedValue',
      };

      // When
      const tracks = service['transformTrack'](mock);
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
      name: 'nameValue',
      fiId: 'fiIdValue',
      fiSub: 'fiSubValue',
      fsId: 'fsId',
      fsSub: 'fsSub',
      scopes: 'gender family_name birth',
      userIp: '172.16.3.1, 172.16.2.6',
      action: 'consent',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      type_action: 'demandeData',
      fi: 'fiLoggedValue',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fs_label: 'fsLabelValue',
    };

    const dataMock: ICsmrTracksLegacyTransformData[] = [
      {
        ...baseMock,
        eidas: 'eidas2',
        time: '2022-02-21',
      },
      {
        ...baseMock,
        eidas: 'eidas2',
        time: '2022-02-21',
      },
      {
        ...baseMock,
        eidas: 'eidas3',
        time: '2022-02-28',
      },
    ];

    const docMock: ICsmrTracksLegacyFieldsData[] = [
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
