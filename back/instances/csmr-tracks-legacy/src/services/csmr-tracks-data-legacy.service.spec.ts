import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';
import { ScopesService } from '@fc/scopes';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import {
  CsmrTracksTransformTracksFailedException,
  CsmrTracksUnknownActionException,
  CsmrTracksUnknownSpException,
} from '../exceptions';
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

  const serviceMongoMock = {
    getById: jest.fn(),
  };

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsmrTracksLegacyDataService,
        LoggerService,
        ScopesService,
        ServiceProviderAdapterMongoService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ScopesService)
      .useValue(scopesMock)
      .overrideProvider(ServiceProviderAdapterMongoService)
      .useValue(serviceMongoMock)
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
    const requestMock = {
      index: 'indexMockValue',
      body: {
        from: 0,
        sort: [{ time: { order: 'desc' } }],
        query: {
          bool: {
            must: [
              { match: { accountId: 'accountIdMockValue' } },
              { range: { time: { gte: 'now-6M/d', lt: 'now' } } },
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { match: { action: 'authentication' } },
                          // Legacy naming
                          // eslint-disable-next-line @typescript-eslint/naming-convention
                          { match: { type_action: 'initial' } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { match: { action: 'consent' } },
                          // Legacy naming
                          // eslint-disable-next-line @typescript-eslint/naming-convention
                          { match: { type_action: 'demandeIdentity' } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { match: { action: 'consent' } },
                          // Legacy naming
                          // eslint-disable-next-line @typescript-eslint/naming-convention
                          { match: { type_action: 'demandeData' } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { match: { action: 'checkedToken' } },
                          // Legacy naming
                          // eslint-disable-next-line @typescript-eslint/naming-convention
                          { match: { type_action: 'verification' } },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    };
    it('should format request with accountId and index', () => {
      // Given / when
      const request = service.formatQuery(indexMock, accountIdMock);
      // Then
      expect(request).toStrictEqual(requestMock);
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

  describe('getFsLabelfromId()', () => {
    const spNameMock = 'spNameValue';
    const fsLabelMock = 'fsLabelValue';

    beforeEach(() => {
      serviceMongoMock.getById.mockResolvedValueOnce({ name: spNameMock });
    });
    it('should return fs label if present as Service Provider name', async () => {
      // Given
      const sourceMock = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        fs_label: fsLabelMock,
        fsId: '42',
      } as unknown as ICsmrTracksLegacyTrack;

      // When
      const name = await service['getFsLabelfromId'](sourceMock);

      // Then
      expect(name).toEqual(fsLabelMock);
      expect(serviceMongoMock.getById).toHaveBeenCalledTimes(0);
    });

    it('should return name from database if fs label is not present in source', async () => {
      // Given
      const sourceMock = { fsId: '42' } as unknown as ICsmrTracksLegacyTrack;

      // When
      const name = await service['getFsLabelfromId'](sourceMock);

      // Then
      expect(name).toEqual(spNameMock);
      expect(serviceMongoMock.getById).toHaveBeenCalledTimes(1);
      expect(serviceMongoMock.getById).toHaveBeenCalledWith(sourceMock.fsId);
    });

    it('should throw an exception if database crashed', async () => {
      // Given
      const sourceMock = {
        fsLabel: 'fsLabelValue',
        fsId: '42',
      } as unknown as ICsmrTracksLegacyTrack;

      const errorMock = new Error('Unknown Error');
      serviceMongoMock.getById.mockReset().mockRejectedValueOnce(errorMock);

      await expect(
        // When
        service['getFsLabelfromId'](sourceMock),
        // Then
      ).rejects.toThrow(CsmrTracksUnknownSpException);
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
    let getFsLabelfromIdMock: jest.SpyInstance;
    let getGeoFromIpMock: jest.SpyInstance;

    const acrValueMock = 'eidas1';
    const eventMock = 'FC_VERIFIED';
    const claimsMock = ['sub', 'given_name', 'gender'];
    const fsLabelMock = 'fsLabelValue';
    const geoIpDataMock = {
      country: 'PR',
      city: 'Pirate',
    };

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

      getFsLabelfromIdMock = jest.spyOn<CsmrTracksLegacyDataService, any>(
        service,
        'getFsLabelfromId',
      );
      getFsLabelfromIdMock.mockResolvedValueOnce(fsLabelMock);

      getGeoFromIpMock = jest.spyOn<CsmrTracksLegacyDataService, any>(
        service,
        'getGeoFromIp',
      );
      getGeoFromIpMock.mockResolvedValueOnce(geoIpDataMock);
    });
    it('should transform source to track data', async () => {
      // Given
      const sourceMock = {
        name: 'nameValue',
        fiId: 'fiIdValue',
        fiSub: 'fiSubValue',
        fsId: 'fsId',
        fsSub: 'fsSub',
        accountId: '42',
        scopes: 'gender family_name birth',
        userIp: '172.16.3.1, 172.16.2.6', // /!\ "172.16.3.1, 172.16.2.6"
        action: 'authentication',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        type_action: 'initial',
        fi: 'fiValue',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        fs_label: 'fsLabelValue',
        eidas: 'eidas1',
        time: '19/02/2022',
      };

      const resultMock = {
        city: 'Pirate',
        claims: ['sub', 'given_name', 'gender'],
        country: 'PR',
        date: '19/02/2022',
        event: 'FC_VERIFIED',
        spAcr: 'eidas1',
        spName: 'fsLabelValue',
      };

      // When
      const tracks = await service['transformTrack'](sourceMock);
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
          time: '21/02/2022',
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
          time: '21/02/2022',
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
          time: '30/02/2022',
        },
      },
    ];

    beforeEach(() => {
      transformTrackMock = jest.spyOn(service, 'transformTrack');
    });

    it('should format tracks from raw tracks', async () => {
      // Given
      transformTrackMock.mockImplementation(({ eidas, time, name }) => {
        return Promise.resolve({
          spAcr: eidas,
          date: time,
          spName: name,
        });
      });

      const tracksOutputMock: Partial<ICsmrTracksOutputTrack>[] = [
        {
          date: '21/02/2022',
          spName: 'nameValue',
          platform: 'FranceConnect',
          spAcr: 'eidas2',
          trackId: 'id1',
        },
        {
          date: '21/02/2022',
          spName: 'nameValue',
          platform: 'FranceConnect',
          spAcr: 'eidas2',
          trackId: 'id2',
        },
        {
          date: '30/02/2022',
          spName: 'nameValue',
          platform: 'FranceConnect',
          spAcr: 'eidas3',
          trackId: 'id3',
        },
      ];

      // When
      const tracks = await service.formattedTracks(rawTracksMock);
      // Then
      expect(tracks).toStrictEqual(tracksOutputMock);
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
