import { Test, TestingModule } from '@nestjs/testing';

import { CsmrTracksTransformTracksFailedException } from '@fc/csmr-tracks';
import { LoggerService } from '@fc/logger-legacy';
import { ScopesService } from '@fc/scopes';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { CsmrTracksUnknownActionException } from '../exceptions';
import { accountQueryMock } from '../fixtures';
import { ICsmrTracksInputLegacy, ICsmrTracksLegacyTrack } from '../interfaces';
import { CsmrTracksLegacyDataService } from './csmr-tracks-data-legacy.service';

describe('CsmrTracksLegacyDataService', () => {
  let service: CsmrTracksLegacyDataService;

  const loggerMock = {
    debug: jest.fn(),
    trace: jest.fn(),
    setContext: jest.fn(),
  };

  const scopesMock = {
    getClaimsFromScopes: jest.fn(),
  };

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CsmrTracksLegacyDataService, LoggerService, ScopesService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ScopesService)
      .useValue(scopesMock)
      .compile();

    service = module.get<CsmrTracksLegacyDataService>(
      CsmrTracksLegacyDataService,
    );
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

  describe('formatQuery()', () => {
    const indexMock = 'indexMockValue';
    const accountIdMock = 'accountIdMockValue';

    it('should format request with accountId and index', () => {
      // Given / when
      const request = service.formatQuery(indexMock, accountIdMock);
      // Then
      expect(request).toStrictEqual(accountQueryMock);
    });
  });

  describe('getEventFromAction()', () => {
    it('should convert action and type_action to corev2 event', () => {
      // Given
      const sourceMock = {
        action: 'checkedToken',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        type_action: 'verification',
      } as unknown as ICsmrTracksLegacyTrack;
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
      } as unknown as ICsmrTracksLegacyTrack;

      expect(
        // When
        () => service['getEventFromAction'](sourceMock),
        // Then
      ).toThrow(CsmrTracksUnknownActionException);
    });
  });

  describe('getClaimsGroups()', () => {
    it('should return null if no scope is present in source tracks', () => {
      // Given
      const sourceMock = {} as unknown as ICsmrTracksLegacyTrack;

      // When
      const claims = service['getClaimsGroups'](sourceMock);

      // Then
      expect(claims).toBeNull();
    });

    it('should get the claims from scopes with missing sub', () => {
      // Given
      const sourceMock = {
        scopes: 'gender, family_name, birth',
      } as unknown as ICsmrTracksLegacyTrack;

      const resultMock = ['gender', 'family_name', 'birthdate', 'birthplace'];

      scopesMock.getClaimsFromScopes.mockReturnValueOnce(resultMock);

      // When
      const claims = service['getClaimsGroups'](sourceMock);

      // Then
      expect(claims).toStrictEqual([...resultMock, 'sub']);
      expect(scopesMock.getClaimsFromScopes).toHaveBeenCalledTimes(1);
      expect(scopesMock.getClaimsFromScopes).toHaveBeenCalledWith([
        'gender',
        'family_name',
        'birth',
      ]);
    });

    it('should get the claims from scopes', () => {
      // Given
      const sourceMock = {
        scopes: 'gender, family_name, birth, sub',
      } as unknown as ICsmrTracksLegacyTrack;

      const resultMock = [
        'sub',
        'gender',
        'family_name',
        'birthdate',
        'birthplace',
      ];

      scopesMock.getClaimsFromScopes.mockReturnValueOnce(resultMock);

      // When
      const claims = service['getClaimsGroups'](sourceMock);

      // Then
      expect(claims).toStrictEqual(resultMock);
      expect(scopesMock.getClaimsFromScopes).toHaveBeenCalledTimes(1);
      expect(scopesMock.getClaimsFromScopes).toHaveBeenCalledWith([
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
      } as unknown as ICsmrTracksLegacyTrack;

      // When
      const acrValue = service['getAcrValue'](sourceMock);
      // Then
      expect(acrValue).toEqual(eidasMock);
    });
    it('should get eidas value from number as string', () => {
      // Given
      const sourceMock = {
        eidas: '3',
      } as unknown as ICsmrTracksLegacyTrack;

      // When
      const acrValue = service['getAcrValue'](sourceMock);
      // Then
      expect(acrValue).toEqual(eidasMock);
    });

    it('should get eidas value from track data', () => {
      // Given
      const sourceMock = {
        eidas: 'eidas3',
      } as unknown as ICsmrTracksLegacyTrack;

      // When
      const acrValue = service['getAcrValue'](sourceMock);
      // Then
      expect(acrValue).toEqual(eidasMock);
    });
  });

  describe('getGeoFromIp()', () => {
    /**
     * @todo add GeoIp management here
     *
     * Arnaud PSA: 07/02/2022
     */
    it('should return country and city from userIp', async () => {
      // Given
      const sourceMock = {
        userIp: '172.16.156.25',
      } as unknown as ICsmrTracksLegacyTrack;

      const resultMock = {
        country: 'FR',
        city: 'Paris',
      };
      // When
      const geoIp = await service['getGeoFromIp'](sourceMock);
      // Then
      expect(geoIp).toStrictEqual(resultMock);
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

    const sourceMock = Object.freeze({
      name: 'nameValue',
      fiId: 'fiIdValue',
      fiSub: 'fiSubValue',
      fsId: 'fsId',
      fsSub: 'fsSub',
      accountId: '42',
      scopes: 'gender family_name birth',
      userIp: '172.16.3.1, 172.16.2.6',
      action: 'authentication',
      // legacy log field
      // eslint-disable-next-line @typescript-eslint/naming-convention
      type_action: 'initial',
      fi: 'fiValue',
      // legacy log field
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fs_label: 'fsLabelValue',
      eidas: 'eidas1',
      time: '2022-10-02',
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
      getGeoFromIpMock.mockResolvedValueOnce(geoIpDataMock);
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
        time: 1664668800000,
        event: 'FC_VERIFIED',
        spAcr: 'eidas1',
        spName: 'fsLabelValue',
        idpName: 'fiValue',
      };

      // When
      const tracks = await service['transformTrack'](mock);
      // Then
      expect(tracks).toStrictEqual(resultMock);
    });
  });

  describe('formattedTracks()', () => {
    let transformTrackMock: jest.SpyInstance;

    const rawTracksMock: ICsmrTracksInputLegacy[] = [
      {
        _index: 'fc',
        _type: 'doc',
        _id: 'id1',
        _score: 1,
        _source: {
          name: 'nameValue',
          fiId: 'fiIdValue',
          fiSub: 'fiSubValue',
          fsId: 'fsId',
          fsSub: 'fsSub',
          accountId: '42',
          scopes: 'gender family_name birth',
          userIp: '172.16.3.1, 172.16.2.6',
          action: 'consent',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          type_action: 'demandeIdentity',
          fi: 'fiValue',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          fs_label: 'fsLabelValue',
          eidas: 'eidas2',
          time: '2022-02-21',
        },
      },
      {
        _index: 'fc',
        _type: 'doc',
        _id: 'id2',
        _score: 1,
        _source: {
          name: 'nameValue',
          fiId: 'fiIdValue',
          fiSub: 'fiSubValue',
          fsId: 'fsId',
          fsSub: 'fsSub',
          accountId: '42',
          scopes: 'gender family_name birth',
          userIp: '172.16.3.1, 172.16.2.6',
          action: 'consent',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          type_action: 'demandeIdentity',
          fi: 'fiValue',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          fs_label: 'fsLabelValue',
          eidas: 'eidas2',
          time: '2022-02-21',
        },
      },
      {
        _index: 'fc',
        _type: 'doc',
        _id: 'id3',
        _score: 1,
        _source: {
          name: 'nameValue',
          fiId: 'fiIdValue',
          fiSub: 'fiSubValue',
          fsId: 'fsId',
          fsSub: 'fsSub',
          accountId: '42',
          scopes: 'gender family_name birth',
          userIp: '172.16.3.1, 172.16.2.6',
          action: 'consent',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          type_action: 'demandeData',
          fi: 'fiValue',
          // eslint-disable-next-line @typescript-eslint/naming-convention
          fs_label: 'fsLabelValue',
          eidas: 'eidas3',
          time: '2022-02-28',
        },
      },
    ];

    beforeEach(() => {
      transformTrackMock = jest.spyOn(service, 'transformTrack');
    });

    it('should format tracks from raw tracks', async () => {
      // Given
      const tracksOutputMock: Partial<ICsmrTracksOutputTrack>[] = [
        {
          time: 1645398000000,
          spName: 'nameValue',
          platform: 'FranceConnect',
          spAcr: 'eidas2',
          trackId: 'id1',
        },
        {
          time: 1645398000000,
          spName: 'nameValue',
          platform: 'FranceConnect',
          spAcr: 'eidas2',
          trackId: 'id2',
        },
        {
          time: 1646002800000,
          spName: 'nameValue',
          platform: 'FranceConnect',
          spAcr: 'eidas3',
          trackId: 'id3',
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
