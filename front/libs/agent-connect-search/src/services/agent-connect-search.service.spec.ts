import Fuse from 'fuse.js';
import { mocked } from 'jest-mock';

import {
  IdentityProvider,
  Ministry,
  PayloadEntities,
  Searchable,
  SearchResult,
} from '../interfaces';
import {
  AgentConnectSearchService,
  FUSE_SEARCH_BASE_OPTIONS,
} from './agent-connect-search.service';

jest.mock('fuse.js');

describe('SearchService', () => {
  const fuseMock = mocked(Fuse);

  const identityProvidersMock: IdentityProvider[] = [
    {
      active: true,
      display: true,
      name: 'Identity Provider 1',
      uid: 'fia1',
    },
    {
      active: true,
      display: true,
      name: 'Identity Provider 2',
      uid: 'fia2',
    },
    {
      active: false,
      display: true,
      name: 'Identity Provider 3',
      uid: 'fia3',
    },
  ];

  const ministriesMock: Ministry[] = [
    {
      id: 'ministryA',
      identityProviders: ['fia1', 'fia2'],
      name: "MOCK - Ministère de l'intérieur - SOME FIS DISABLED - SORT 1",
      sort: 1,
    },
    {
      id: 'ministryB',
      identityProviders: ['fia2', 'fia3'],
      name: 'MOCK - Ministère de la transition écologique - ALL FIS - SORT 2',
      sort: 2,
    },
    {
      id: 'ministryC',
      identityProviders: [],
      name: "MOCK - Ministère de l'économie des Finances et de la Relance - NO FIS - SORT 3",
      sort: 3,
    },
    {
      id: 'ministryD',
      identityProviders: ['fia3', 'fia1', 'undefined-fi'],
      name: 'MOCK - Ministère de la mer - E2E - SORT 4',
      sort: 4,
    },
    {
      id: 'ministryE',
      identityProviders: ['undefined-fi'],
      name: 'MOCK - Ministère sans FI valide - SORT 5',
      sort: 5,
    },
  ];

  const baseExpected: Searchable[] = [
    // Ministry A
    {
      data: "Identity Provider 1 ministryA MOCK - Ministère de l'intérieur - SOME FIS DISABLED - SORT 1",
      idpId: 'fia1',
      ministryId: 'ministryA',
      sort: 1,
    },
    {
      data: "Identity Provider 2 ministryA MOCK - Ministère de l'intérieur - SOME FIS DISABLED - SORT 1",
      idpId: 'fia2',
      ministryId: 'ministryA',
      sort: 1,
    },
    // Ministry B
    {
      data: 'Identity Provider 2 ministryB MOCK - Ministère de la transition écologique - ALL FIS - SORT 2',
      idpId: 'fia2',
      ministryId: 'ministryB',
      sort: 2,
    },
    {
      data: 'Identity Provider 3 ministryB MOCK - Ministère de la transition écologique - ALL FIS - SORT 2',
      idpId: 'fia3',
      ministryId: 'ministryB',
      sort: 2,
    },
    // Ministry C
    {
      data: "ministryC MOCK - Ministère de l'économie des Finances et de la Relance - NO FIS - SORT 3",
      idpId: undefined,
      ministryId: 'ministryC',
      sort: 3,
    },
    // Ministry D
    {
      data: 'Identity Provider 3 ministryD MOCK - Ministère de la mer - E2E - SORT 4',
      idpId: 'fia3',
      ministryId: 'ministryD',
      sort: 4,
    },
    {
      data: 'Identity Provider 1 ministryD MOCK - Ministère de la mer - E2E - SORT 4',
      idpId: 'fia1',
      ministryId: 'ministryD',
      sort: 4,
    },
    // Ministry E
    {
      data: 'ministryE MOCK - Ministère sans FI valide - SORT 5',
      idpId: undefined,
      ministryId: 'ministryE',
      sort: 5,
    },
  ];

  const baseSearchResults: SearchResult[] = [
    {
      identityProviders: [identityProvidersMock[0], identityProvidersMock[1]],
      ministry: ministriesMock[0],
    },
    {
      identityProviders: [identityProvidersMock[1]],
      ministry: ministriesMock[1],
    },
    {
      identityProviders: [],
      ministry: ministriesMock[2],
    },
  ];

  const payloadEntitiesMock: PayloadEntities = {
    identityProviders: {
      fia1: identityProvidersMock[0],
      fia2: identityProvidersMock[1],
      fia3: identityProvidersMock[2],
    },
    ministries: {
      ministryA: ministriesMock[0],
      ministryB: ministriesMock[1],
      ministryC: ministriesMock[2],
      ministryD: ministriesMock[3],
      ministryE: ministriesMock[4],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    AgentConnectSearchService.FUSE_INSTANCE = {
      search: jest.fn(),
    } as unknown as Fuse<Searchable>;
  });

  describe('initialize', () => {
    it('should call storeRawData', () => {
      // Given
      const spy = jest.spyOn(AgentConnectSearchService, 'storeRawData');
      // When
      AgentConnectSearchService.initialize(ministriesMock, identityProvidersMock);
      // Then
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(ministriesMock, identityProvidersMock);
    });

    it('should affect result from storeRawData to RAW_DATA', () => {
      // Given
      const storeRawDataReturnMock = {} as unknown as PayloadEntities;
      jest
        .spyOn(AgentConnectSearchService, 'storeRawData')
        .mockReturnValueOnce(storeRawDataReturnMock);
      // When
      AgentConnectSearchService.initialize(ministriesMock, identityProvidersMock);
      // Then
      expect(AgentConnectSearchService.RAW_DATA).toBe(storeRawDataReturnMock);
    });

    it('should call prepareSearchDataBase', () => {
      // Given
      const spy = jest.spyOn(AgentConnectSearchService, 'prepareSearchDataBase');
      // When
      AgentConnectSearchService.initialize(ministriesMock, identityProvidersMock);
      // Then
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(ministriesMock, identityProvidersMock);
    });

    it('should affect result from prepareSearchDataBase to SEARCHABLES', () => {
      // Given
      const prepareSearchDataBaseReturnMock =
        'prepareSearchDataBaseReturnMock' as unknown as Searchable[];
      jest
        .spyOn(AgentConnectSearchService, 'prepareSearchDataBase')
        .mockReturnValueOnce(prepareSearchDataBaseReturnMock);
      // When
      AgentConnectSearchService.initialize(ministriesMock, identityProvidersMock);
      // Then
      expect(AgentConnectSearchService.SEARCHABLES).toBe(prepareSearchDataBaseReturnMock);
    });

    it('should instantiate Fuse', () => {
      // Given
      // When
      AgentConnectSearchService.initialize(ministriesMock, identityProvidersMock);

      // Then
      expect(fuseMock).toHaveBeenCalledTimes(1);
      expect(fuseMock).toHaveBeenCalledWith(
        AgentConnectSearchService.SEARCHABLES,
        FUSE_SEARCH_BASE_OPTIONS,
      );
    });
  });

  describe('prepareSearchDataBase', () => {
    it('should return a flattened list of ministries and identity providers', () => {
      // When
      const result = AgentConnectSearchService.prepareSearchDataBase(
        ministriesMock,
        identityProvidersMock,
      );
      // Then
      expect(result).toStrictEqual(baseExpected);
    });
  });

  describe('searchableReducer', () => {
    it('should return an array with as many elements as the ministry as idps', () => {
      // Given
      const accumulatorMock: Searchable[] = [];
      const ministryMock = ministriesMock[0];
      // When
      const result = AgentConnectSearchService.searchableReducer(
        accumulatorMock,
        ministryMock,
        identityProvidersMock,
      );
      // Then
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(ministryMock.identityProviders.length);
    });

    it('should return an array with only one element with undefined idpId if ministry has no idps', () => {
      // Given
      const accumulatorMock: Searchable[] = [];
      const ministryMock = ministriesMock[2];
      // When
      const result = AgentConnectSearchService.searchableReducer(
        accumulatorMock,
        ministryMock,
        identityProvidersMock,
      );
      // Then
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(1);
      expect(result[0].idpId).toBeUndefined();
    });

    it('should return an array containing two searchable elements', () => {
      // Given
      const accumulatorMock: Searchable[] = [];
      const ministryMock = ministriesMock[0];
      // When
      const result = AgentConnectSearchService.searchableReducer(
        accumulatorMock,
        ministryMock,
        identityProvidersMock,
      );
      // Then
      expect(result[0]).toStrictEqual(baseExpected[0]);
      expect(result[1]).toStrictEqual(baseExpected[1]);
    });
  });

  describe('storeRawData', () => {
    it('should return hashmap of ministries and identity providers', () => {
      // When
      const result = AgentConnectSearchService.storeRawData(ministriesMock, identityProvidersMock);
      // Then
      expect(result).toStrictEqual(payloadEntitiesMock);
    });
  });

  describe('formatSearchResults', () => {
    it('should return formatted results', () => {
      // Given
      const rawResultsMock = [
        {
          item: baseExpected[0],
          refIndex: 1,
        },
        {
          item: baseExpected[1],
          refIndex: 2,
        },
        {
          item: baseExpected[2],
          refIndex: 3,
        },
        {
          item: baseExpected[4],
          refIndex: 3,
        },
      ];
      // When
      const result = AgentConnectSearchService.formatSearchResults(
        rawResultsMock,
        payloadEntitiesMock,
      );
      // Then
      expect(result).toStrictEqual(baseSearchResults);
    });
  });

  describe('search', () => {
    it('should call fuse.search', () => {
      // Given
      const termMock = 'some search';
      AgentConnectSearchService.FUSE_INSTANCE = {
        search: jest.fn().mockReturnValueOnce([]),
      } as unknown as Fuse<Searchable>;

      // When
      AgentConnectSearchService.search(termMock);
      // Then
      expect(AgentConnectSearchService.FUSE_INSTANCE.search).toHaveBeenCalledTimes(1);
      expect(AgentConnectSearchService.FUSE_INSTANCE.search).toHaveBeenCalledWith(termMock);
    });

    it('should call formatSearchResults with search results', () => {
      // Given
      const searchResultMock = [] as unknown as Fuse.FuseResult<Searchable>;
      const termMock = 'some search';
      AgentConnectSearchService.FUSE_INSTANCE = {
        search: jest.fn().mockReturnValueOnce(searchResultMock),
      } as unknown as Fuse<Searchable>;

      const spy = jest.spyOn(AgentConnectSearchService, 'formatSearchResults');

      // When
      AgentConnectSearchService.search(termMock);
      // Then
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(searchResultMock, AgentConnectSearchService.RAW_DATA);
    });

    it('should return result from formatSearchResults', () => {
      // Given
      const searchResultMock = [] as unknown as Fuse.FuseResult<Searchable>;
      const formattedResultMock = [] as unknown as SearchResult[];
      const termMock = 'some search';
      AgentConnectSearchService.FUSE_INSTANCE = {
        search: jest.fn().mockReturnValueOnce(searchResultMock),
      } as unknown as Fuse<Searchable>;

      jest
        .spyOn(AgentConnectSearchService, 'formatSearchResults')
        .mockReturnValueOnce(formattedResultMock);

      // When
      const result = AgentConnectSearchService.search(termMock);
      // Then
      expect(result).toBe(formattedResultMock);
    });
  });
});
