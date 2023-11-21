import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { IdpMappings } from '../dto';
import { Platform } from '../enums';
import {
  CsmrTracksTransformTracksFailedException,
  CsmrTracksUnknownActionException,
} from '../exceptions';
import { ICsmrTracksLegacyFieldsData } from '../interfaces';
import { CsmrTracksGeoService } from '../services';
import { TracksLegacyFormatter } from './tracks-legacy.formatter';

describe('TracksLegacyFormatter', () => {
  let service: TracksLegacyFormatter;

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

  const geoIpMock = {
    getGeoFromIp: jest.fn(),
  };

  const geoIpResultMock = {
    city: 'geo city mock',
    country: 'geo country mock',
  };

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TracksLegacyFormatter,
        ConfigService,
        CsmrTracksGeoService,
        LoggerService,
        {
          provide: 'ScopesFcLegacy',
          useValue: scopesMock,
        },
      ],
    })
      .overrideProvider(CsmrTracksGeoService)
      .useValue(geoIpMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<TracksLegacyFormatter>(TracksLegacyFormatter);

    configMock.get.mockReturnValue(configDataMock);

    geoIpMock.getGeoFromIp.mockReturnValue(geoIpResultMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set logger context', () => {
    expect(loggerMock.setContext).toHaveBeenCalledTimes(1);
    expect(loggerMock.setContext).toHaveBeenCalledWith('TracksLegacyFormatter');
  });

  describe('formatTrack()', () => {
    const getIdpLabelMockResult = Symbol('getIdpLabelMockResult');
    const getAcrValueMockResult = Symbol('getAcrValueMockResult');
    const getEventFromActionMockResult = Symbol('getEventFromActionMockResult');
    const getClaimsGroupsMockResult = Symbol('getClaimsGroupsMockResult');

    beforeEach(() => {
      service['getIdpLabel'] = jest
        .fn()
        .mockReturnValueOnce(getIdpLabelMockResult);
      service['getAcrValue'] = jest
        .fn()
        .mockReturnValueOnce(getAcrValueMockResult);
      service['getEventFromAction'] = jest
        .fn()
        .mockReturnValueOnce(getEventFromActionMockResult);
      service['getClaimsGroups'] = jest
        .fn()
        .mockReturnValueOnce(getClaimsGroupsMockResult);
    });

    it('should return formatted track', () => {
      // Given
      const inputMock = {
        _id: 'trackId',
        _source: {
          // Legacy field name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          fs_label: 'spLabel',
          time: 'time',
          fi: 'fiLoggedValue',
          eidas: 'eidas',
          action: 'action',
          // Legacy field name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          type_action: 'typeAction',
          claims: 'claims',
        },
      } as unknown as SearchHit<ICsmrTracksLegacyFieldsData>;

      // When
      const formattedTrack = service.formatTrack(inputMock);

      // Then
      expect(formattedTrack).toEqual({
        event: getEventFromActionMockResult,
        time: expect.any(Number),
        spLabel: 'spLabel',
        spAcr: getAcrValueMockResult,
        idpLabel: getIdpLabelMockResult,
        country: geoIpResultMock.country,
        city: geoIpResultMock.city,
        claims: getClaimsGroupsMockResult,
        platform: Platform.FCP_LOW,
        trackId: 'trackId',
      });
    });

    it('should throw an exception if an error occurs', () => {
      // Given
      const inputMock = {
        _id: 'trackId',
        _source: {
          // Legacy field name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          fs_label: 'spLabel',
          time: 'time',
          fi: 'fiLoggedValue',
          eidas: 'eidas',
          action: 'action',
          // Legacy field name
          // eslint-disable-next-line @typescript-eslint/naming-convention
          type_action: 'typeAction',
          claims: 'claims',
        },
      } as unknown as SearchHit<ICsmrTracksLegacyFieldsData>;

      const errorMock = new Error('error');

      service['getIdpLabel'] = jest.fn().mockImplementation(() => {
        throw errorMock;
      });

      // When
      expect(() => service.formatTrack(inputMock)).toThrow(
        new CsmrTracksTransformTracksFailedException(errorMock),
      );
    });
  });

  describe('getEventFromAction()', () => {
    it('should convert action and type_action to corev2 event', () => {
      // Given
      const sourceMock = {
        action: 'checkedToken',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        type_action: 'verification',
      } as unknown as ICsmrTracksLegacyFieldsData;
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
      } as unknown as ICsmrTracksLegacyFieldsData;

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
      const sourceMock = {} as unknown as ICsmrTracksLegacyFieldsData;

      // When
      const claims = service['getClaimsGroups'](sourceMock);

      // Then
      expect(claims).toEqual([]);
    });

    it('should get the claims from scopes', () => {
      // Given
      const sourceMock = {
        scopes: 'gender, family_name, birth, sub',
      } as unknown as ICsmrTracksLegacyFieldsData;

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
      } as unknown as ICsmrTracksLegacyFieldsData;

      // When
      const acrValue = service['getAcrValue'](sourceMock);
      // Then
      expect(acrValue).toEqual(eidasMock);
    });
    it('should get eidas value from number as string', () => {
      // Given
      const sourceMock = {
        eidas: '3',
      } as unknown as ICsmrTracksLegacyFieldsData;

      // When
      const acrValue = service['getAcrValue'](sourceMock);
      // Then
      expect(acrValue).toEqual(eidasMock);
    });

    it('should get eidas value from track data', () => {
      // Given
      const sourceMock = {
        eidas: 'eidas3',
      } as unknown as ICsmrTracksLegacyFieldsData;

      // When
      const acrValue = service['getAcrValue'](sourceMock);
      // Then
      expect(acrValue).toEqual(eidasMock);
    });

    it('should get eidas1 value if eidas is missing', () => {
      // Given
      const sourceMock = {} as unknown as ICsmrTracksLegacyFieldsData;

      // When
      const acrValue = service['getAcrValue'](sourceMock);
      // Then
      expect(acrValue).toEqual('eidas1');
    });
  });

  describe('getIdpLabel', () => {
    it('should return mapping value from idpName if present in mapping', () => {
      // Given
      const sourceMock = {
        fi: 'fiLoggedValue',
      } as ICsmrTracksLegacyFieldsData;

      // When
      const label = service['getIdpLabel'](sourceMock);

      // Then
      expect(label).toEqual('fiMappedValue');
    });

    it('should return idpName value if idpName mappings is unavailable', () => {
      // Given
      const sourceMock = {
        fi: 'NonMappedValue',
      } as ICsmrTracksLegacyFieldsData;

      // When
      const label = service['getIdpLabel'](sourceMock);

      // Then
      expect(label).toEqual('NonMappedValue');
    });
  });
});
