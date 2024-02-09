import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Inject } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { ScopesService } from '@fc/scopes';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { IdpMappings } from '../dto';
import { CoreInstance, Platform } from '../enums';
import { CsmrTracksTransformTracksFailedException } from '../exceptions';
import { ICsmrTracksV2FieldsData } from '../interfaces';
import { CsmrTracksGeoService } from '../services';
import { TracksV2Formatter } from './tracks-v2.formatter';

describe('CsmrTracksV2DataService', () => {
  let service: TracksV2Formatter;

  const loggerMock = getLoggerMock();
  const configMock = getConfigMock();

  const configDataMock: Partial<IdpMappings> = {
    mappings: {
      fiTest: 'fiTestValue',
    },
  };

  const scopesMock = {
    getRichClaimsFromClaims: jest.fn(),
  };

  const geoIpMock = {
    getGeoFromIp: jest.fn(),
  };

  const geoIpDataMock = {
    country: Symbol('Country'),
    city: Symbol('City'),
  };

  const platformMock = Platform.FCP_LOW;

  class TestService extends TracksV2Formatter {
    constructor(
      protected readonly config: ConfigService,
      protected readonly logger: LoggerService,
      protected readonly geoip: CsmrTracksGeoService,
      @Inject('ScopesFcpLow') protected readonly scopes: ScopesService,
    ) {
      super(config, logger, geoip, scopes, platformMock);
    }
  }

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestService,
        CsmrTracksGeoService,
        LoggerService,
        ConfigService,
        {
          provide: 'ScopesFcpLow',
          useValue: scopesMock,
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CsmrTracksGeoService)
      .useValue(geoIpMock)
      .overrideProvider(ScopesService)
      .useValue(scopesMock)
      .compile();

    service = module.get<TestService>(TestService);

    geoIpMock.getGeoFromIp.mockReturnValue(geoIpDataMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getClaimsGroups()', () => {
    it('should return an empty array if no scope are present in source tracks', () => {
      // Given
      const sourceMock = {} as unknown as ICsmrTracksV2FieldsData;

      // When
      const claims = service['getClaimsGroups'](sourceMock);

      // Then
      expect(claims).toEqual([]);
    });

    it('should return the return of scopesService.getRichClaimsFromClaims()', () => {
      // Given
      const sourceMock = {
        claims: 'sub gender family_name birthdate birthplace',
      } as unknown as ICsmrTracksV2FieldsData;

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

  describe('getIdpLabel', () => {
    beforeEach(() => {
      configMock.get.mockReturnValueOnce(configDataMock);
    });

    it('should return idpLabel if data exist on source', () => {
      // Given
      const sourceMock = {
        idpLabel: 'idpLabelValue',
      } as unknown as ICsmrTracksV2FieldsData;

      // When
      const label = service['getIdpLabel'](sourceMock);

      // Then
      expect(label).toEqual('idpLabelValue');
    });
    it('should return mapping value from idpName if idpLabel was missing', () => {
      // Given
      const sourceMock = {
        idpName: 'fiTest',
      } as unknown as ICsmrTracksV2FieldsData;

      // When
      const label = service['getIdpLabel'](sourceMock);

      // Then
      expect(label).toEqual('fiTestValue');
    });
    it('should return idpName value if neither idpLabel and idpName mappings are unavailable', () => {
      // Given
      const sourceMock = {
        idpName: 'idpNameValue',
      } as unknown as ICsmrTracksV2FieldsData;

      // When
      const label = service['getIdpLabel'](sourceMock);

      // Then
      expect(label).toEqual('idpNameValue');
    });
  });

  describe('formatTrack()', () => {
    const claimsMock = ['sub', 'given_name', 'gender'];

    const sourceMock = {
      _id: 'idValue',
      _source: {
        source: {
          geo: {
            // Input data
            // eslint-disable-next-line @typescript-eslint/naming-convention
            city_name: undefined,
            // Input data
            // eslint-disable-next-line @typescript-eslint/naming-convention
            country_iso_code: 'FR',
            // Input data
            // eslint-disable-next-line @typescript-eslint/naming-convention
            region_name: 'Ile-de-France',
          },
        },
        idpId: 'idpIdValue',
        idpAcr: 'idpAcrValue',
        idpLabel: 'idpLabelValue',
        ip: '172.168.2.2',
        spSub: 'spSubValue',
        idpSub: 'idpSubValue',
        spName: 'spNameValue',
        idpName: 'idpNameValue',
        event: 'FC_VERIFIED',
        spId: 'spIdValue',
        spAcr: 'eidas1',
        time: 1664661600000,
        service: CoreInstance.FCP_LOW,
      },
    } as SearchHit<ICsmrTracksV2FieldsData>;

    beforeEach(() => {
      service['getClaimsGroups'] = jest.fn().mockReturnValueOnce(claimsMock);
      service['getIdpLabel'] = jest
        .fn()
        .mockImplementation(({ idpLabel }) => idpLabel);
    });

    it('should transform source to track data', () => {
      // Given
      const resultMock = {
        country: geoIpDataMock.country,
        city: geoIpDataMock.city,
        claims: ['sub', 'given_name', 'gender'],
        time: 1664661600000,
        event: 'FC_VERIFIED',
        spAcr: 'eidas1',
        spLabel: 'spNameValue',
        idpLabel: 'idpLabelValue',
        platform: platformMock,
        trackId: 'idValue',
      };

      // When
      const tracks = service.formatTrack(sourceMock);
      // Then
      expect(tracks).toStrictEqual(resultMock);
    });

    it('should throw an error if an error occured', () => {
      // Given
      const errorMock = new Error('Test');
      service['getClaimsGroups'] = jest.fn().mockImplementation(() => {
        throw errorMock;
      });

      // Then / When
      expect(() => service.formatTrack(sourceMock)).toThrow(
        new CsmrTracksTransformTracksFailedException(errorMock),
      );
    });
  });
});
