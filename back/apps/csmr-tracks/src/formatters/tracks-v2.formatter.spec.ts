import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Inject } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { ScopesService } from '@fc/scopes';
import {
  CoreInstance,
  getLocationFromTracks,
  TracksFormatterMappingFailedException,
  TracksV2FieldsInterface,
} from '@fc/tracks-adapter-elasticsearch';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { IdpMappings } from '../dto';
import { Platform } from '../enums';
import { TracksV2Formatter } from './tracks-v2.formatter';

jest.mock('@fc/tracks-adapter-elasticsearch/utils');

describe('TracksV2Formatter', () => {
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
    getRichClaimsFromScopes: jest.fn(),
  };

  const localisationMock = {
    city: Symbol('City') as unknown as string,
    country: Symbol('Country') as unknown as string,
  };

  const platformMock = Platform.FCP_LOW;

  class TestService extends TracksV2Formatter {
    constructor(
      protected readonly config: ConfigService,
      protected readonly logger: LoggerService,
      @Inject('ScopesFcpLow') protected readonly scopes: ScopesService,
    ) {
      super(config, logger, scopes, platformMock);
    }
  }

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestService,
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
      .overrideProvider(ScopesService)
      .useValue(scopesMock)
      .compile();

    service = module.get<TestService>(TestService);

    jest.mocked(getLocationFromTracks).mockReturnValue(localisationMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getClaimsGroups()', () => {
    it('should return an empty array if no scope are present in source tracks', () => {
      // Given
      const sourceMock = {} as unknown as TracksV2FieldsInterface;

      // When
      const claims = service['getClaimsGroups'](sourceMock);

      // Then
      expect(claims).toEqual([]);
    });

    it('should return the return of scopesService.getRichClaimsFromClaims()', () => {
      // Given
      const sourceMock = {
        claims: 'sub gender family_name birthdate birthplace',
      } as unknown as TracksV2FieldsInterface;

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

    it('should return the return of scopesService.getRichClaimsFromScopes()', () => {
      // Given
      const sourceMock = {
        scope: 'gender family_name birthdate birthplace',
      } as unknown as TracksV2FieldsInterface;

      const getRichClaimsFromScopesMockReturnedValue = Symbol(
        'getRichClaimsFromScopeMockReturnedValue',
      );
      scopesMock.getRichClaimsFromScopes.mockReturnValueOnce(
        getRichClaimsFromScopesMockReturnedValue,
      );

      // When
      const claims = service['getClaimsGroups'](sourceMock);

      // Then
      expect(claims).toBe(getRichClaimsFromScopesMockReturnedValue);
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
      } as unknown as TracksV2FieldsInterface;

      // When
      const label = service['getIdpLabel'](sourceMock);

      // Then
      expect(label).toEqual('idpLabelValue');
    });
    it('should return mapping value from idpName if idpLabel was missing', () => {
      // Given
      const sourceMock = {
        idpName: 'fiTest',
      } as unknown as TracksV2FieldsInterface;

      // When
      const label = service['getIdpLabel'](sourceMock);

      // Then
      expect(label).toEqual('fiTestValue');
    });
    it('should return idpName value if neither idpLabel and idpName mappings are unavailable', () => {
      // Given
      const sourceMock = {
        idpName: 'idpNameValue',
      } as unknown as TracksV2FieldsInterface;

      // When
      const label = service['getIdpLabel'](sourceMock);

      // Then
      expect(label).toEqual('idpNameValue');
    });
  });

  describe('formatTrack()', () => {
    const claimsMock = ['sub', 'given_name', 'gender'];

    // Legacy field name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const geoMock = { city_name: 'Paris', country_iso_code: 'FR' };

    const sourceMock = {
      _id: 'idValue',
      _source: {
        source: { geo: geoMock },
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
        spAcr: 'acrFromSpAcr',
        interactionAcr: 'acrFromInteractionAcr',
        time: 1664661600000,
        service: CoreInstance.FCP_LOW,
        browsingSessionId: 'authenticationEventIdValue',
      },
    } as SearchHit<TracksV2FieldsInterface>;

    beforeEach(() => {
      service['getClaimsGroups'] = jest.fn().mockReturnValueOnce(claimsMock);
      service['getIdpLabel'] = jest
        .fn()
        .mockImplementation(({ idpLabel }) => idpLabel);
    });

    it('should transform source to track data', () => {
      // Given
      const resultMock = {
        country: localisationMock.country,
        city: localisationMock.city,
        claims: ['sub', 'given_name', 'gender'],
        time: 1664661600000,
        event: 'FC_VERIFIED',
        interactionAcr: 'acrFromInteractionAcr',
        spLabel: 'spNameValue',
        idpLabel: 'idpLabelValue',
        platform: platformMock,
        trackId: 'idValue',
        authenticationEventId: 'authenticationEventIdValue',
      };

      // When
      const tracks = service.formatTrack(sourceMock);
      // Then
      expect(tracks).toStrictEqual(resultMock);
    });

    it('should use spAcr if interactionAcr is not set', () => {
      // Given
      const sourceWithoutInteractionAcrMock = {
        ...sourceMock,
        _source: {
          ...sourceMock._source,
          interactionAcr: undefined,
        },
      };

      const resultMock = {
        country: localisationMock.country,
        city: localisationMock.city,
        claims: ['sub', 'given_name', 'gender'],
        time: 1664661600000,
        event: 'FC_VERIFIED',
        interactionAcr: 'acrFromSpAcr',
        spLabel: 'spNameValue',
        idpLabel: 'idpLabelValue',
        platform: platformMock,
        trackId: 'idValue',
        authenticationEventId: 'authenticationEventIdValue',
      };

      // When
      const tracks = service.formatTrack(sourceWithoutInteractionAcrMock);
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
        new TracksFormatterMappingFailedException(errorMock),
      );
    });
  });
});
