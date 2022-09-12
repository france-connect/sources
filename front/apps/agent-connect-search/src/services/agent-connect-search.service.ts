import Fuse from 'fuse.js';

import {
  IdentityProvider,
  Ministry,
  PayloadEntities,
  Searchable,
  SearchResult,
} from '../interfaces';

export const FUSE_SEARCH_BASE_OPTIONS = {
  findAllMatches: false,
  ignoreLocation: true,
  includeMatches: false,
  includeScore: false,
  isCaseSensitive: false,
  keys: ['data'],
  maxPatternLength: 64,
  minMatchCharLength: 1,
  shouldSort: true,
  threshold: 0.1,
};

export class AgentConnectSearchService {
  static SEARCHABLES: Searchable[];

  static FUSE_INSTANCE: Fuse<Searchable>;

  static RAW_DATA: PayloadEntities;

  static initialize(ministries: Ministry[], identityProviders: IdentityProvider[]) {
    // Store raw data for later use
    AgentConnectSearchService.RAW_DATA = AgentConnectSearchService.storeRawData(
      ministries,
      identityProviders,
    );

    // Optimize data for search engine
    AgentConnectSearchService.SEARCHABLES = AgentConnectSearchService.prepareSearchDataBase(
      ministries,
      identityProviders,
    );

    // Instantiate and keep a singleton of search engine
    AgentConnectSearchService.FUSE_INSTANCE = new Fuse(
      AgentConnectSearchService.SEARCHABLES,
      FUSE_SEARCH_BASE_OPTIONS,
    );
  }

  static storeRawData(ministriesArray: Ministry[], identityProvidersArray: IdentityProvider[]) {
    const identityProviders = Object.fromEntries(
      identityProvidersArray.map((idp) => [idp.uid, idp]),
    );
    // @NOTE pourquoi pas un reduce pour rendre plus lisible plus rapidement ?
    // 1 reduce vs 2 operations
    const ministries = Object.fromEntries(
      ministriesArray.map((ministry) => [ministry.id, ministry]),
    );

    const dataBase: PayloadEntities = {
      identityProviders,
      ministries,
    };

    return dataBase;
  }

  static searchableReducer(
    accumulator: Searchable[],
    ministry: Ministry,
    identityProviders: IdentityProvider[],
  ): Searchable[] {
    const { id: ministryId, name: ministryName, sort } = ministry;

    const filteredIdps = ministry.identityProviders.filter((idpId) => {
      const idp = identityProviders.find(({ uid }) => uid === idpId);
      return Boolean(idp);
    });
    // @NOTE
    // add a undefined element
    // => ministries w/o identity providers will also appears into search results
    // => so we inform users the ministry has not yet subscribe to agent-connect
    const iterables = filteredIdps.length ? filteredIdps : [undefined];

    const results = iterables.map((idpId) => {
      const idp = identityProviders.find(({ uid }) => uid === idpId);
      const data = `${ministryId} ${ministryName}`;
      const searchable = {
        data: idp ? `${idp.name} ${data}` : data,
        idpId,
        ministryId,
        sort,
      };
      return searchable;
    });

    return [...accumulator, ...results];
  }

  static prepareSearchDataBase(
    ministries: Ministry[],
    identityProviders: IdentityProvider[],
  ): Searchable[] {
    const searchables = ministries.reduce<Searchable[]>((acc, ministry) => {
      const result = AgentConnectSearchService.searchableReducer(acc, ministry, identityProviders);
      return result;
    }, []);

    return searchables;
  }

  static formatSearchResults(
    results: Fuse.FuseResult<Searchable>[],
    rawData: PayloadEntities,
  ): SearchResult[] {
    // @todo sort the proper way ,?
    // @todo pipe ?
    const regroupedByMinistry = results
      .map(({ item }) => item)
      .sort((a, b) => a.sort - b.sort)
      .reduce((acc: { [key: string]: SearchResult }, item) => {
        const key = item.ministryId;
        const ministry = rawData.ministries[key];
        const previousGroup = acc[key]?.identityProviders || [];
        const identityProviders = !item.idpId
          ? previousGroup
          : [...previousGroup, rawData.identityProviders[item.idpId]];
        const next = { identityProviders, ministry };
        return { ...acc, [key]: next };
      }, {});

    const formattedResults = Object.values(regroupedByMinistry);
    return formattedResults;
  }

  static search(term: string): SearchResult[] {
    const results = AgentConnectSearchService.FUSE_INSTANCE.search<Searchable>(term);

    const formatted = AgentConnectSearchService.formatSearchResults(
      results,
      AgentConnectSearchService.RAW_DATA,
    );

    return formatted;
  }
}
